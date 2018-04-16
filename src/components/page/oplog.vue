<template>
  <div class="oplog prop-box">
    <!--操作日志-->
    <div class="m-oplog">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>操作日志列表<span></span>
        <div class="u-right log_search">
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
            <el-option label="管理员名称" value="0"></el-option>
            <el-option label="操作动作" value="1"></el-option>
            <el-option label="IP地址" value="2"></el-option>
          </el-select>
          <el-input placeholder="搜索关键词" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_roles(true)"></el-button>
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
          prop="manager"
          label="管理员名称"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="action"
          label="操作动作"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="content"
          label="日志的详细描述"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="操作IP地址"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="time"
          label="操作时间"
          min-width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-button v-if="_super == 1" type="danger" size="small" icon="delete" @click="del_role(scope.$index, tableData)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button v-if="_super==1" :plain="true" type="danger" @click="del_role('all', '')">删除</el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  import page from '../common/page.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `网站系统操作日志, 由总平台设置管理.点击列表里的删除按钮删除单个日志时不受复选框的影响！复选框数据只在点击列表下方批量删除时有效`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        add_show: false, // 是否弹出管理员编辑页面
        del_id: [], // 收集编辑的id
        search_type: '',
        search_str: '',
        totalPage: 1, // 总页
        _super: 0,
        loading: true
      }
    },
    mounted() {
      this.get_roles()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_roles()
      },
      // 获取
      get_roles(search) {
        window.axiox.post(this.getApi('root/auth/log_list'),
          this.dafa({
            search_type: this.search_type,
            search_str: this.search_str,
            index: this.index
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.list;
            this.totalPage = res.data.fy_pgCount;
            this._super = res.data.super
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
      // 删除
      del_role(index, rows) {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (index === 'all') {
            this.multipleSelection.forEach(item => {
              this.del_id.push(item.id)
            })
          } else {
            this.del_id.push(rows[index].id)
          }

          axiox.post(this.getApi('root/auth/log_del'),
            this.dafa({
              id_list: this.del_id
            })
          ).then(res => {
            if (res.data.code === 0) {
              this.get_roles();
              this.$message(res.data.msg);
              this.del_id = []
            } else {
              this.$message(res.data.msg);
              this.toggleSelection();
              this.del_id = []
            }
          }).catch((err) => {
//            console.log(err);
            this.$message('对不起！请稍后再试');
            this.toggleSelection();
            this.del_id = []
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
    components: {hint, page}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*管理员*/
  .m-oplog > h2 {
    font-size: 16px;
    line-height: 36px;
    margin-bottom: 10px;
  }

  .log_search .el-input {
    /*float: left;*/
    width: 290px;
  }

  /*添加管理员*/
</style>
