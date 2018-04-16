<template>
  <div class="goods-evaluate-list prop-box">
    <!--商品评价-->
    <div class="m-goods-evaluate-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>商品评价列表
        <!--<el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_member('','')">添加会员
        </el-button>-->
        <div class="u-right">
          <el-select class="sele-s" v-model="point" placeholder="评分" :clearable="true">
            <el-option label="一星" value="1"></el-option>
            <el-option label="二星" value="2"></el-option>
            <el-option label="三星" value="3"></el-option>
            <el-option label="四星" value="4"></el-option>
            <el-option label="五星" value="5"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="status" placeholder="状态" :clearable="true">
            <el-option label="未评价" value="0"></el-option>
            <el-option label="已评价" value="1"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
            <el-option label="评价人" value="0"></el-option>
            <el-option label="评价内容" value="1"></el-option>
            <el-option label="订单编号" value="2"></el-option>
          </el-select>
          <el-input placeholder="搜索关键词" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_goods_evaluate"></el-button>
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
          prop="order_no"
          label="订单编号"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="point"
          label="评分"
          min-width="200">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.point"
              disabled
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="评论内容"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="good_name"
          label="商品名称"
          min-width="260">
          <template slot-scope="scope">
            <a :href="scope.row.good_link" target="_blank">{{scope.row.good_name}}</a>
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="good_link"-->
        <!--label="商品链接"-->
        <!--min-width="140">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="buy_time"
          label="下单时间"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="comment_time"
          label="评论时间"
          min-width="160">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-button type="danger" size="small" icon="delete" @click="del_goods_evaluate(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_goods_evaluate('all', '')">删除
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
          content: `买家可在订单完成后对订单商品进行评价操作，评价信息将显示在对应的商品页面。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        point: '', // 评分  1=一星 2=二星...5=五星
        status: '', // 状态  0=未评价 1=已评价
        search_type: '', // 搜索类型 0=评价人 1=评价内容 2=订单编号
        search_str: '', // 搜索内容
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_goods_evaluate()
    },
    methods: {
      // 监听子分页组件 翻页
      to_page() {
        this.get_goods_evaluate()
      },
      // 获取资金日志列表
      get_goods_evaluate() {
        window.axiox.post(this.getApi('root/auth/review_list'),
          this.dafa({
            index: this.index,
            point: this.point,
            status: this.status,
            search_type: this.search_type,
            search_str: this.search_str
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.list;
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
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
      // 删除评价
      del_goods_evaluate(id) {
        this.$confirm('是否确认删除?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/review_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_goods_evaluate();
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
