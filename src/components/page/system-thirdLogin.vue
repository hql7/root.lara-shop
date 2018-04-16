<template>
  <!--短信邮箱配置-->
  <div class="m-type-list m-prop-box">
    <hint :title="hint.title" :content="hint.content"></hint>
    <el-form :model="ruleForm" ref="ruleForm" label-width="240px" class="demo-ruleForm">
      <h1 class="font">微信登录配置</h1>
      <el-form-item label="微信登录app_id">
        <el-input type="password" v-model="ruleForm.wx.WX_CLIENT_ID"></el-input>
      </el-form-item>
      <el-form-item label="微信登录app_secret">
        <el-input type="password" v-model="ruleForm.wx.WX_CLIENT_SECRET"></el-input>
      </el-form-item>
      <el-form-item label="微信登录回调地址">
        <el-input v-model="ruleForm.wx.WX_REDIRECT_URL"></el-input>
      </el-form-item>
      <h1 class="font">QQ登录配置</h1>
      <el-form-item label="QQ登录app_id">
        <el-input type="password" v-model="ruleForm.qq.QQ_CLIENT_ID"></el-input>
      </el-form-item>
      <el-form-item label="QQ登录app_secret">
        <el-input type="password" v-model="ruleForm.qq.QQ_CLIENT_SECRET"></el-input>
      </el-form-item>
      <el-form-item label="QQ登录回调地址">
        <el-input v-model="ruleForm.qq.QQ_REDIRECT_URL"></el-input>
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
        type: 1,
        ruleForm: {
          wx: {
            WX_CLIENT_ID: '',
            WX_CLIENT_SECRET: '',
            WX_REDIRECT_URL: '',
          },
          qq: {
            QQ_CLIENT_ID: '',
            QQ_CLIENT_SECRET: '',
            QQ_REDIRECT_URL: '',
          }
        } // 编辑页面表单数据
      }
    },
    created() {
      this.get_data()
    },
    methods: {
      get_data() {
        axiox.post(this.getApi('root/auth/env_config_page'),
          `type=` + this.type
        ).then(res => {
          if (res.data.code === 0) {
            this.ruleForm.wx = res.data.wx;
            this.ruleForm.qq = res.data.qq;
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
              window.axiox.post(this.getApi('root/auth/env_config_save'),
                this.dafa({
                  type: this.type,
                  wx: this.ruleForm.wx,
                  qq: this.ruleForm.qq
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
