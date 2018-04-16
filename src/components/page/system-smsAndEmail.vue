<template>
  <!--短信邮箱配置-->
  <div class="m-type-list m-prop-box">
    <hint :title="hint.title" :content="hint.content"></hint>
    <el-form :model="ruleForm" ref="ruleForm" label-width="240px" class="demo-ruleForm">
      <h1 class="font">邮箱配置</h1>
      <el-form-item label="邮件发送驱动">
        <el-input v-model="ruleForm.email.MAIL_DRIVER"></el-input>
      </el-form-item>
      <el-form-item label="邮件发送服务器(SMTP)">
        <el-input v-model="ruleForm.email.MAIL_HOST"></el-input>
      </el-form-item>
      <el-form-item label="服务器(SMTP)端口">
        <el-input v-model="ruleForm.email.MAIL_PORT"></el-input>
      </el-form-item>
      <el-form-item label="邮箱账号">
        <el-input v-model="ruleForm.email.MAIL_USERNAME"></el-input>
      </el-form-item>
      <el-form-item label="邮箱密码/授权码">
        <el-input type="password" v-model="ruleForm.email.MAIL_PASSWORD"></el-input>
      </el-form-item>
      <el-form-item label="发送邮件使用的用户名">
        <el-input v-model="ruleForm.email.MAIL_FROM_NAME"></el-input>
      </el-form-item>
      <el-form-item label="邮箱加密类型">
        <el-input v-model="ruleForm.email.MAIL_ENCRYPTION"></el-input>
      </el-form-item>
      <h1 class="font">短信配置</h1>
      <el-form-item label="短信平台[appkey]">
        <el-input type="password" v-model="ruleForm.alidayu.SMS_APP_KEY"></el-input>
      </el-form-item>
      <el-form-item label="短信平台[secretKey]">
        <el-input type="password" v-model="ruleForm.alidayu.SMS_SECRET_KEY"></el-input>
      </el-form-item>
      <el-form-item label="短信签名">
        <el-input v-model="ruleForm.alidayu.SMS_SIGN_NAME"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确 认 保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `网站全局基本设置，商城及其他模块相关内容在其各自栏目设置项内进行操作。`
        }, // 提示模块参数
        type: 0,
        ruleForm: {
          email: {
            MAIL_DRIVER: '',
            MAIL_HOST: '',
            MAIL_PORT: '',
            MAIL_USERNAME: '',
            MAIL_PASSWORD: '',
            MAIL_FROM_NAME: '',
            MAIL_ENCRYPTION: '',
          },
          alidayu: {
            SMS_APP_KEY: '',
            SMS_SECRET_KEY: '',
            SMS_SIGN_NAME: '',
          }
        } // 编辑页面表单数据
      }
    },
    created() {
      this.get_data()
    },
    methods: {
      // 获取数据
      get_data() {
        axiox.post(this.getApi('root/auth/env_config_page'),
          `type=` + this.type
        ).then(res => {
          if (res.data.code === 0) {
            this.ruleForm.email = res.data.email;
            this.ruleForm.alidayu = res.data.alidayu;
            this.ruleForm.alidayu.SMS_SIGN_NAME = this.base().utf8to16(this.base().base64decode(this.ruleForm.alidayu.SMS_SIGN_NAME))
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
          this.ruleForm.alidayu.SMS_SIGN_NAME = this.base().base64encode(this.base().utf16to8(this.ruleForm.alidayu.SMS_SIGN_NAME));
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/env_config_save'),
                this.dafa({
                  type: this.type,
                  email: this.ruleForm.email,
                  alidayu: this.ruleForm.alidayu
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.get_data()
                }
              }).catch(err => {
                reject(err);
                console.log(err);
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
