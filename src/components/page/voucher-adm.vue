<template>
  <div class="goods-evaluate-list prop-box">
    <!--代金券管理-->
    <div class="m-goods-evaluate-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>代金券列表
        <!--<el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_member('','')">导出数据
        </el-button>-->
        <div class="u-right">
          <el-select class="sele-s" v-model="disabled" placeholder="是否禁用" :clearable="true">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="status" placeholder="代金券状态" :clearable="true">
            <el-option label="未使用" value="0"></el-option>
            <el-option label="已使用" value="1"></el-option>
            <el-option label="已过期" value="2"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
            <el-option label="代金券名称" value="0"></el-option>
            <el-option label="代金券账号" value="1"></el-option>
          </el-select>
          <el-input placeholder="搜索关键词" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_voucher"></el-button>
          </el-input>
        </div>
      </h2>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        stripe
        ref="multipleTable"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-dropdown @command="handle($event,scope.row.id)">
              <el-button type="primary" size="small">
                处理<i class="el-icon-setting el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="i-box">
                <el-dropdown-item command="0" v-if="scope.row.disabled==0"><i
                  class="iconfont icon-jinzhi c-danger"></i>&nbsp;禁用
                </el-dropdown-item>
                <el-dropdown-item command="1" v-if="scope.row.disabled==1"><i
                  class="iconfont icon-huifu-copy c-danger"></i>&nbsp;解禁
                </el-dropdown-item>
                <el-dropdown-item command="2"><i
                  class="iconfont icon-shanchu3 c-danger"></i>&nbsp;删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="代金券名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="type"
          label="代金券类型"
          min-width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">指定发放</span>
            <span v-else-if="scope.row.type==2">免费领取 </span>
            <span v-else-if="scope.row.type==3">线下发放</span>
            <span v-else>下单赠送</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="condition"
          label="使用限制"
          min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.condition==1">指定商品可用</span>
            <span v-else-if="scope.row.condition==2">指定分类可用 </span>
            <span v-else>全店通用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="account"
          label="账号"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="password"
          label="密码"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="value"
          label="面额"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="point"
          label="兑换所需积分"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="money"
          label="使用需满金额"
          min-width="140">
        </el-table-column>
        <el-table-column
          label="代金券状态"
          min-width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">已使用</span>
            <span v-else-if="scope.row.status==2">已过期 </span>
            <span v-else>未使用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否禁用"
          min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.disabled==1">禁用</span>
            <span v-else>正常</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="begin_end_time"
          label="有效使用区间"
          min-width="280">
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_voucher('all', 2)">删除
        </el-button>
        <el-button :plain="true" type="danger"
                   @click="del_voucher('', 3)">一键删除过期券
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
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
          content: `优惠促销管理, 由平台设置管理。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        disabled: '', // 是否禁用  0=正常 1=禁用
        status: '', // 代金券状态  0=未使用 1=已使用 2=已过期
        search_type: '', // 搜索类型  0=代金券名称 1=代金券账号
        search_str: '', // 搜索内容
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_voucher()
    },
    methods: {
      // 监听子分页组件 翻页
      to_page() {
        this.get_voucher()
      },
      // 获取代金券列表
      get_voucher() {
        window.axiox.post(this.getApi('root/auth/voucher_list'),
          this.dafa({
            index: this.index,
            status: this.status,
            disabled: this.disabled,
            search_type: this.search_type,
            search_str: this.search_str
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
      // 操作
      handle(val, id) { //val 0=禁用 1=解禁 2=删除  id 操作id
        this.id = id;
        this.del_voucher(id, val)
      },
      // 取消选择
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      // 收集选中列
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 删除
      del_voucher(id) {
        this.$confirm('是否确认操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (id === 'all') {
            this.multipleSelection.forEach(item => {
              this.del_id.push(item.id)
            })
          } else {
            this.del_id.push(id)
          }

          this.antiShake.antiShake((resolve, reject) => {
            window.axiox.post(this.getApi('root/auth/voucher_act'),
              this.dafa({
                id_list: this.del_id,
                type: val
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_voucher();
              } else {
                this.toggleSelection();
              }
            }).catch((err) => {
              reject(err);
              console.log(err);
              this.toggleSelection();
              this.del_id = []
            })
          })
        }).catch(() => {
          this.toggleSelection();
          this.del_id = [];
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
