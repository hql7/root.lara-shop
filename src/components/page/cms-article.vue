<template>
  <div class="type-list prop-box">
    <!--全部文章-->
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>全部文章
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_article('')">新增文章
        </el-button>
        <div class="u-right">
          <el-select class="sele-s" v-model="article" placeholder="文章分类">
            <el-option v-for="item in article_list" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-input class="search"
                    placeholder="搜索关键词"
                    icon="el-icon-search"
                    v-model="search">
            <el-button slot="append" icon="el-icon-search" @click="get_article"></el-button>
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
          prop="title"
          label="文章标题"
          min-width="240">
        </el-table-column>
        <el-table-column
          prop="cate_name"
          label="分类名称"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="是否显示"
          min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">显示</span>
            <span v-else>不显示</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="publish_time"
          label="发布时间"
          min-width="160">
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="link"-->
        <!--label="文章链接"-->
        <!--min-width="220">-->
        <!--</el-table-column>-->
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
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="ruleForm.cate_id" @visible-change="get_category" placeholder="请选择分类">
            <el-option v-for="item in category" :label="item.name" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="文章链接" prop="out_link">-->
        <!--<el-input v-model="ruleForm.out_link"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="ruleForm.publish_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="STIME"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch
            v-model="ruleForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value=0
            :inactive-value=1
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="文章内容">
          <editor @getEditor="getEditor" :content="content"></editor>
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
  import Editor from '../common/editor.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `文章管理, 由平台设置管理。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        article: '', // 文章分类
        article_list: [],
        search: '',
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '全部文章',
          now: '文章编辑'
        }, // 面包屑模块参数
        ruleForm: {
          title: '',
          cate_id: '',
          publish_time: '',
          status: null
        }, // 编辑页面表单数据
        rules: {
          title: [
            {required: true, message: '请输入文章标题', trigger: 'blur'}
          ],
          cate_id: [
            {required: true, message: '请选择分类', trigger: 'blur'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        category: [],
        content: '', // 文章详情
        loading: true
      }
    },
    created() {
      this.get_article();
      this.get_FL();
    },
    methods: {
      // 监听子组件 编辑器内容
      getEditor(data) {
        this.content = data
      },
      // 分类
      get_category(val) {
        if (val) {
          axiox.post(this.getApi('root/auth/category_list')
          ).then((res) => {
            if (res.data.code === 0) {
              this.category = res.data.list;
            } else {
              this.$message(res.data.msg);
            }
          }).catch(err => {
            this.$message('对不起！请稍后再试')
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
      // 获取文章列表
      get_article() {
        window.axiox.post(this.getApi('root/auth/article_list'),
          this.dafa({
            cate_id: this.article,
            title: this.search,
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
      // 编辑文章
      edit_article(id) {
        this.antiShake.antiShake((resolve, reject) => {
          this.id = id;
          window.axiox.post(this.getApi('root/auth/article_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info) {
                this.ruleForm = res.data.info;
                this.content = res.data.info.content;
                this.category = [{'id': res.data.info.cate_id, 'name': res.data.info.cate_name}];
              } else {
                this.ruleForm = {
                  title: '',
                  cate_id: '',
                  publish_time: '',
                  status: null
                };
                this.content = ''
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
        this.$confirm('是否确认删除文章?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/article_del'),
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
      // 获取分类
      get_FL() {
        axiox.post(this.getApi('root/auth/category_list'),
          `index=0`
        ).then(res => {
          if (res.data.code == 0) {
            this.article_list = res.data.list
          }
        })
      },
      // 时间格式
      STIME(val) {
        this.ruleForm.publish_time = val;
      },
      // 提交表单
      submitForm(formName) {
        // 处理提交所需规格数据格式
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/article_save'),
                this.dafa({
                  id: this.id,
                  title: this.ruleForm.title,
                  cate_id: this.ruleForm.cate_id,
                  publish_time: this.ruleForm.publish_time,
                  status: this.ruleForm.status,
                  content: this.content
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
      hint, crumb, page, Editor
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
