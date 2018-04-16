<template>
  <div class="type-list prop-box">
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>标签管理
        <!--<el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_cms('','')">新增位置
        </el-button>-->
        <div class="u-right">
          <el-select class="sele-s" v-model="is_hot" placeholder="是否热门">
            <el-option label="普通" value="0"></el-option>
            <el-option label="热门" value="1"></el-option>
          </el-select>
          <el-input class="search"
                    placeholder="搜索关键词"
                    icon="el-icon-search"
                    v-model="search">
            <el-button slot="append" icon="el-icon-search" @blur="get_cms"></el-button>
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
          prop="name"
          label="标签名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="num"
          label="搜索数"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="is_hot"
          label="是否热门"
          min-width="120">
          <template slot-scope="scope">
            <span v-if=" scope.row.is_hot == 0 ">普通</span>
            <span v-else>热门</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sort" @blur="set_sort(scope.row.id, scope.row.sort)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-dropdown @command="handle($event,scope.row.id)">
              <el-button>
                处理<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0" v-if="scope.row.is_hot == 0 "><i
                  class="iconfont icon-zhiding c-danger"></i>&nbsp;置顶
                </el-dropdown-item>
                <el-dropdown-item command="1" v-if="scope.row.is_hot == 1 "><i
                  class="iconfont icon-quxiaozhiding1 c-danger"></i>&nbsp;取消置顶
                </el-dropdown-item>
                <el-dropdown-item command="2"><i class="iconfont icon-shanchu4 c-danger"></i>&nbsp;删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_cms('all')">删除
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
          content: `标签管理前台搜索条件进行排序。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        is_hot: '', // 是否热门  0=普通 1=热门
        search: '',
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_cms();
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_cms()
      },
      // 获取列表
      get_cms() {
        window.axiox.post(this.getApi('root/auth/tags_list'),
          this.dafa({
            tag_name: this.search,
            is_hot: this.is_hot,
            index: this.index
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
      // 排序
      set_sort(id, sort) {
        axiox.post(this.getApi('root/auth/tags_sort'),
          this.dafa({
            id: id,
            sort: sort
          })
        ).then(res => {
          if (res.data.code == 0) {
            this.$message(res.data.msg);
            this.get_cms()
          } else {
            this.$message(res.data.msg)
          }
        })
      },
      // 编辑
      /* edit_cms (index, rows) {
       this.id = index === '' ? '' : rows[index].id;
       window.axiox.post(this.getApi('root/auth/position_edit'),
       `id=${this.id}`
       ).then(res => {
       if (res.data.code === 0) {
       this.add_show = true;
       if (res.data.info) {
       this.ruleForm = res.data.info;
       this.imageUrl = res.data.info.img;
       }
       } else {
       this.$message(res.data.msg)
       }
       }).catch((err) => {
       //          console.log(err)
       this.$message('对不起！请稍后再试')
       });
       },*/
      // 处理
      handle(val, id) {
        this.id = id;
        switch (val) {
          case '0':
            this.to_top(val);
            break;
          case '1':
            this.to_top(val);
            break;
          case '2':
            this.del_cms()
        }
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
      del_cms(id) {
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
            this.del_id.push(this.id)
          }

          this.antiShake.antiShake((resolve, reject) => {
            window.axiox.post(this.getApi('root/auth/tags_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_cms();
              } else {
                this.toggleSelection();
              }
            }).catch((err) => {
              reject(err);
              console.log(err);
              // this.$message('对不起！请稍后再试');
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
      },
      // 置顶|取消
      to_top(val) {
        axiox.post(this.getApi('root/auth/tags_top'),
          this.dafa({
            id: this.id,
            type: val
          })
        ).then(res => {
          if (res.data.code == 0) {
            this.$message(res.data.msg);
            this.get_cms()
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.$message('对不起！请稍后再试')
        })
      },
      /*  // 提交表单
       submitForm (formName) {
       // 处理提交所需规格数据格式
       this.$refs[formName].validate((valid) => {
       if (valid) {
       window.axiox.post(this.getApi('root/auth/position_save'),
       this.dafa({
       id: this.id,
       position_name: this.ruleForm.position_name,
       ad_width: this.ruleForm.ad_width,
       ad_height: this.ruleForm.ad_height,
       position_desc: this.ruleForm.position_desc,
       is_open: this.ruleForm.is_open
       })
       ).then(res => {
       if (res.data.code === 0) {
       this.$message(res.data.msg);
       this.add_show = false;
       this.get_cms()
       } else {
       this.$message(res.data.msg)
       }
       }).catch(err => {
       console.log(err);
       this.$message('对不起！请稍后再试。具体错误已打印在控制台')
       })
       } else {
       this.$message('请检查填写信息是否有误');
       return false
       }
       })
       }*/
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
