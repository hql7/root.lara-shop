<template>
  <div class="type-list prop-box">
    <!--区域管理-->
    <div class="m-type-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>区域列表
      </h2>
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        ref="tree"
        node-key="id"
        :props="defaultProps"
        :filter-node-method="filterNode">
      </el-tree>
    </div>
    <!--添加类型-->
    <div class="add-type prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="快递公司名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="快递公司别名">
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
    data () {
      return {
        hint: {
          title: '操作提示',
          content: `全站所有涉及的地区均来源于此处，强烈建议对此处谨慎操作。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '地区列表',
          now: '编辑地区'
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
            {required: true, type: 'number', message: '不可为空', trigger: 'blur'}
          ]
        }, // 验证规则
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: 'true'
      }
    },
    created () {
      this.get_system()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back () {
        this.add_show = false
      },
      // 获取
      get_system () {
        axiox.post(this.getApi('root/auth/area_list')
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.list
          } else {
            this.loading = '';
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
      },
      // 编辑
      edit_system (index, rows) {
        this.id = index === '' ? '' : rows[index].id
        window.axiox.post(this.getApi('root/auth/express_company_edit'),
          `id=${this.id}`
        ).then(res => {
          if (res.data.code === 0) {
            this.add_show = true
            if (res.data.info) this.ruleForm = res.data.info
          } else {
            this.$message(res.data.msg)
          }
        }).catch((err) => {
//          console.log(err)
          this.$message('对不起！请稍后再试')
        })
      },
      // 删除
      del_system (index, rows) {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.axiox.post(this.getApi('root/auth/express_company_del'),
            this.dafa({
              id_list: this.del_id
            })
          ).then(res => {
            if (res.data.code === 0) {
              this.get_system()
              this.$message(res.data.msg)
              this.del_id = []
            } else {
              this.$message(res.data.msg)
              this.toggleSelection()
              this.del_id = []
            }
          }).catch((err) => {
            console.log(err)
            this.$message('对不起！请稍后再试')
            this.toggleSelection()
            this.del_id = []
          })
        }).catch(() => {
          this.toggleSelection()
          this.del_id = []
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 提交表单
      submitForm (formName) {
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
                this.$message(res.data.msg)
                this.add_show = false
                this.get_system()
              } else {
                this.$message(res.data.msg)
              }
            }).catch(err => {
              console.log(err)
              this.$message('对不起！请稍后再试。具体错误已打印在控制台')
            })
          } else {
            this.$message('请检查填写信息是否有误')
            return false
          }
        })
      },
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      }
    },
    components: {
      hint, crumb
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-tree {
    margin-top: 25px;
  }
</style>
