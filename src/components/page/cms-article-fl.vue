<template>
  <div class="type-list prop-box">
    <!--全部文章分类-->
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>文章分类列表
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_article('')">新增文章分类
        </el-button>
        <!--<div class="u-right">
          &lt;!&ndash;<el-select class="sele-s" v-model="article" placeholder="文章分类">
            <el-option label="全部文章" value="0">
            </el-option>
          </el-select>&ndash;&gt;
          <el-input class="search"
                    placeholder="搜索关键词"
                    icon="el-icon-search"
                    v-model="search">
            <el-button slot="append" icon="el-icon-search" @click="get_article"></el-button>
          </el-input>
        </div>-->
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
          label="分类名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="parent_name"
          label="上级分类名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="desc"
          label="分类描述"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="alias"
          label="别名"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="80">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_article(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_article(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_article('all')">删除
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--添加类型-->
    <div class="add-type prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上级分类">
          <el-select v-model="ruleForm.parent_id" @visible-change="get_category1" placeholder="请选择分类">
            <el-option v-for="item in category1" :label="item.name" :key="item.id" :value="item.id"></el-option>
          </el-select>
          <!--<el-input v-model="ruleForm.parent_id"></el-input>-->
          <em class="c-danger">&nbsp;&nbsp;&nbsp;只能添加一级分类下面的分类</em>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="ruleForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="ruleForm.alias"></el-input>
        </el-form-item>
        <el-form-item label="分类描述" prop="desc">
          <el-input type="textarea"
                    :rows="2" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  import crumb from '../common/crumb.vue'
  import page from '../common/page.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `新增文章时，可选择文章分类。文章分类将在前台文章列表页显示。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        article: '', // 文章分类
        search: '',
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '文章分类',
          now: '分类编辑'
        }, // 面包屑模块参数
        ruleForm: {
          name: '',
          parent_id: '',
          sort: '',
          alias: '',
          desc: ''
        }, // 编辑页面表单数据
        rules: {
          name: [
            {required: true, message: '请输入分类名', trigger: 'blur'}
          ],
          alias: [
            {required: true, message: '请输入分类别名', trigger: 'blur'}
          ],
          sort: [
            {required: true, type: 'number', message: '请输入排序', trigger: 'blur'}
          ],
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        category1: [],
        loading: true
      }
    },
    created() {
      this.get_article()
    },
    methods: {
      //获取一级分类
      get_category1(val) {
        if (val) {
          axiox.post(this.getApi('root/auth/category_list'),
            this.dafa({
              cate_id: 0
            })
          ).then(res => {
            if (res.data.code === 0) {
              this.category1 = res.data.list;
            } else {
              this.$message(res.data.msg);
            }
          }).catch(err => {
            this.$message('对不起，请稍后再试');
          })
        }
      },
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_article()
      },
      // 获取分类列表
      get_article() {
        window.axiox.post(this.getApi('root/auth/category_list'),
          this.dafa({
            cate_id: this.article,
            title: this.search,
            index: this.index
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
      // 编辑文章
      edit_article(id) {
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/category_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info) {
                this.ruleForm = res.data.info;
                this.category1 = [{id: res.data.info.parent_id, name: res.data.info.parent_name}]
              } else {
                this.ruleForm = {
                  name: '',
                  parent_id: '',
                  sort: '',
                  alias: '',
                  desc: ''
                }
              }
            }
          }).catch((err) => {
            reject(err);
            console.log(err);
            // this.$message('对不起！请稍后再试')
          })
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
      // 删除文章
      del_article(id) {
        this.$confirm('是否确认删除文章分类?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/category_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_article();
              } else {
                this.toggleSelection();
              }
            }).catch((err) => {
              reject(err);
              console.log(err);
              // this.$message('对不起！请稍后再试');
              this.toggleSelection();
              this.del_id = [];
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
      // 提交表单
      submitForm(formName) {
        // 处理提交所需规格数据格式
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/category_save'),
                this.dafa({
                  id: this.id,
                  name: this.ruleForm.name,
                  parent_id: this.ruleForm.parent_id,
                  sort: this.ruleForm.sort,
                  alias: this.ruleForm.alias,
                  desc: this.ruleForm.desc
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_article();
                }
              }).catch(err => {
                reject(err);
                console.log(err);
                // this.$message('对不起！请稍后再试。具体错误已打印在控制台')
              })
            })
          } else {
            this.$message('请检查填写信息是否有误');
            return false
          }
        })
      }
    },
    computed: {
      index() {
        return this.$store.state.index
      }
    },
    components: {
      hint, crumb, page
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
