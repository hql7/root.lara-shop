<template>
  <!--七牛云存储配置-->
  <div class="m-type-list m-prop-box">
    <hint :title="hint.title" :content="hint.content"></hint>
    <el-form :model="ruleForm" ref="ruleForm" label-width="240px" class="demo-ruleForm">
      <h1 class="font">七牛云存储配置</h1>
      <el-form-item label="存储区域" required>
        <el-radio v-model="ruleForm.region" label="z0">华东</el-radio>
        <el-radio v-model="ruleForm.region" label="z1">华北</el-radio>
        <el-radio v-model="ruleForm.region" label="z2">华南</el-radio>
        <el-radio v-model="ruleForm.region" label="na0">北美</el-radio>
      </el-form-item>
      <el-form-item label="Bucket_Name 存储空间名" required>
        <el-input v-model="ruleForm.Bucket_Name"></el-input>
      </el-form-item>
      <el-form-item label="Domain 地址域名" required>
        <el-input v-model="ruleForm.Domain"></el-input>
      </el-form-item>
      <el-form-item label="ACCESS_KEY 密钥" required>
        <el-input v-model="ruleForm.ACCESS_KEY"></el-input>
      </el-form-item>
      <el-form-item label="SECRET_KEY 密钥" required>
        <el-input type="password" v-model="ruleForm.SECRET_KEY"></el-input>
      </el-form-item>
      <el-form-item label="deadline 超时时间" required>
        <el-input v-model="ruleForm.deadline"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确 认 保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import hint from '@/components/common/hint.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `七牛云存储空间配置参数，选择开启可以将网站图片存储在七牛云，减轻服务器压力。`
        }, // 提示模块参数
        title: 'qiniu',
        ruleForm: {
          region: 'z0',
          Bucket_Name: '',
          Domain: '',
          ACCESS_KEY: '',
          SECRET_KEY: '',
          deadline: 1577808000
        }, // 编辑页面表单数据
      }
    },
    created() {
      this.get_data()
    },
    methods: {
      get_data() {
        axiox.post(this.getApi('root/auth/config_page'),
          `title=${this.title}`
        ).then(res => {
          if (res.data.code === 0) {
            this.ruleForm = Object.assign(this.ruleForm, res.data.kv);
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.$message('对不起！请稍后再试')
        })
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              axiox.post(this.getApi('root/auth/config_save'),
                this.dafa({
                  title: this.title,
                  kv: this.ruleForm
                })
              ).then(res => {
                resolve(res);
                // this.$message(res.data.msg);
                if (res.data.code === 0) {
                  this.get_data()
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
    components: {
      hint
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-form .el-input, .el-textarea {
    width: 420px;
  }

  .el-button {
    width: 120px;
  }

  .font {
    font-size: 18px;
    margin-bottom: 25px;
  }
</style>
