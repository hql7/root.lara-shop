<template>
  <div class="member-list prop-box">
    <!--资金日志-->
    <div class="m-member-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>资金日志列表
        <!--<el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_member('','')">添加会员
        </el-button>-->
        <div class="u-right">
          <el-date-picker
            v-model="date_time"
            type="datetimerange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择时间范围"
            @change="choice_time"
            align="right">
          </el-date-picker>
          <!--<el-select class="sele-s" v-model="wallet_type" placeholder="钱包类型" :clearable="true">-->
          <!--<el-option label="账户余额" value="0"></el-option>-->
          <!--<el-option label="购物积分" value="1"></el-option>-->
          <!--</el-select>-->
          <el-select class="sele-s" v-model="type" placeholder="事件类型" :clearable="true">
            <el-option label="订单支付" value="0"></el-option>
            <el-option label="用户充值" value="1"></el-option>
            <el-option label="管理员充值" value="2"></el-option>
            <el-option label="提现" value="3"></el-option>
            <el-option label="转账" value="4"></el-option>
          </el-select>
          <el-input placeholder="搜索用户名" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_balance_log"></el-button>
          </el-input>
        </div>
      </h2>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        stripe
        ref="multipleTable">
        <el-table-column
          prop="id"
          label="日志ID"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="time"
          label="时间"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="type"
          label="事件类型"
          min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.type==0">订单支付</span>
            <span v-else-if="scope.row.type==1">用户充值</span>
            <span v-else-if="scope.row.type==2">管理员充值</span>
            <span v-else-if="scope.row.type==3">提现</span>
            <span v-else-if="scope.row.type==4">转账</span>
            <span v-else-if="scope.row.type==5">管理员扣款</span>
            <span v-else-if="scope.row.type==6">管理员退款</span>
            <span v-else-if="scope.row.type==7">管理员退款</span>
            <span v-else-if="scope.row.type==8">管理员冻结</span>
            <span v-else-if="scope.row.type==9">管理员解冻</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="amount_log"
          label="余额快照"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="wallet_type"
          label="钱包类型"
          min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.wallet_type==0">账户余额</span>
            <span v-else-if="scope.row.wallet_type==1">支付宝</span>
            <span v-else-if="scope.row.wallet_type==2">冻结资金</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="admin_name"
          label="管理员名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注"
          min-width="320">
        </el-table-column>
      </el-table>
    </div>
    <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  //  import crumb from '../common/crumb.vue'
  import page from '../common/page.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `资金日记全部记录, 由总平台管理。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }, // 时间范围选择
        date_time: '', // 所选时间
        start_time: '', // 起始时间
        end_time: '', // 截止时间
        type: '', // 事件类型 0=订单支付 1=用户充值 2=管理员充值 3=提现 4=转账 5=管理员扣款 6=管理员退款
        search_str: '', // 搜索内容
        totalPage: 1, // 总页
        loading: true
      }
    },
    created() {
      this.get_balance_log()
    },
    methods: {
      // 监听子分页组件 翻页
      to_page() {
        this.get_balance_log()
      },
      // 获取资金日志列表
      get_balance_log() {
        window.axiox.post(this.getApi('root/auth/balance_log'),
          this.dafa({
            index: this.index,
            begin_time: this.start_time,
            end_time: this.end_time,
//            wallet_type: this.wallet_type,
            type: this.type,
            username: this.search_str
          })
        ).then(res => {
          this.loading = false
          if (res.data.code === 0) {
            this.tableData = res.data.list;
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message('对不起！请稍后再试')
        })
      },
      // 选择时间处理数据格式
      choice_time(val) {
        // let start = Date.parse(new Date(val.substr(0, 19)));
        // let end = Date.parse(new Date(val.substr(22, 19)));
        let start = Date.parse(new Date(val[0]));
        let end = Date.parse(new Date(val[1]));
        this.start_time = start / 1000;
        this.end_time = end / 1000;
      }
    },
    computed: {
      index() {
        return this.$store.state.index
      }
    },
    components: {
      hint, page
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
