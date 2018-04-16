<template>
  <div class="type-list prop-box">
    <!--快递公司-->
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content" :link="hint.link"></hint>
      <h2>快递公司列表
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_system('','')">新增快递公司
        </el-button>
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
          label="快递公司名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="alias"
          label="快递公司别名"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="code"
          label="快递100Code"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="url"
          label="快递公司网址"
          min-width="160">
          <template slot-scope="scope">
            <a :href="scope.row.url">{{scope.row.url}}</a>
          </template>
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
            <el-button type="primary" size="small" icon="edit" @click="edit_system(scope.$index, tableData)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_system(scope.$index, tableData)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_system('all', '')">删除
        </el-button>
      </div>
      <!--<page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>-->
    </div>
    <!--添加类型-->
    <div class="add-type prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="快递公司名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="快递公司别名" prop="alias">
          <el-input v-model="ruleForm.alias"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="ruleForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="快递100Code" prop="code">
          <el-input v-model="ruleForm.code"></el-input>
        </el-form-item>
        <el-form-item label="快递公司网址">
          <el-input v-model="ruleForm.url"></el-input>
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
  //  import page from '../common/page.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `全站所有涉及的地区均来源于此处，强烈建议对此处谨慎操作。对应的公司代码见`,
          link: {
            name: '《API URL 所支持的快递公司及参数说明》',
            url: 'https://www.kuaidi100.com/download/api_kuaidi100_com(20140729).doc'
          }
        }, // 提示模块参数
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
//        totalPage: 1, // 总页
//        article: '', // 文章分类
//        search: '',
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '快递公司列表',
          now: '编辑快递公司'
        }, // 面包屑模块参数
        ruleForm: {
          name: '',
          alias: '',
          sort: '',
          code: '',
          url: ''
        }, // 编辑页面表单数据
        rules: {
          name: [
            {required: true, message: '不可为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '不可为空', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '不可为空'},
            {type: 'number', message: '必须为数字'}
          ],
          alias: [
            {required: true, message: '不可为空', trigger: 'blur'},
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_system()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      /* to_page () {
       this.system()
       },*/
      // 获取
      get_system() {
        window.axiox.post(this.getApi('root/auth/express_company_list')
        ).then(res => {
          this.loading = false
          if (res.data.code === 0) {
            this.tableData = res.data.list;
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message('对不起！请稍后再试')
        })
      },
      // 编辑
      edit_system(index, rows) {
        this.id = index === '' ? '' : rows[index].id;
        window.axiox.post(this.getApi('root/auth/express_company_edit'),
          `id=${this.id}`
        ).then(res => {
          if (res.data.code === 0) {
            this.add_show = true;
            if (res.data.info) {
              this.ruleForm = res.data.info;
            } else {
              this.ruleForm = {
                name: '',
                alias: '',
                sort: '',
                code: '',
                url: ''
              }
            }
          } else {
            this.$message(res.data.msg)
          }
        }).catch((err) => {
//          console.log(err)
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
      del_system(index, rows) {
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

          window.axiox.post(this.getApi('root/auth/express_company_del'),
            this.dafa({
              id: this.del_id
            })
          ).then(res => {
            if (res.data.code === 0) {
              this.get_system();
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
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            window.axiox.post(this.getApi('root/auth/express_company_save'),
              this.dafa({
                id: this.id,
                name: this.ruleForm.name,
                code: this.ruleForm.code,
                sort: this.ruleForm.sort,
                alias: this.ruleForm.alias,
                url: this.ruleForm.url
              })
            ).then(res => {
              if (res.data.code === 0) {
                this.$message(res.data.msg);
                this.add_show = false;
                this.get_system()
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
      }
    },
    components: {
      hint, crumb
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
