<template>
  <!--微信支付配置-->
  <div class="m-type-list m-prop-box">
    <hint :title="hint.title" :content="hint.content"></hint>
    <el-form :model="ruleForm" ref="ruleForm" label-width="240px" class="demo-ruleForm">
      <h1 class="font">微信支付配置</h1>
      <el-form-item label="公众号APPID">
        <el-input v-model="ruleForm.app_id"></el-input>
      </el-form-item>
      <el-form-item label="小程序APPID">
        <el-input v-model="ruleForm.miniapp_id"></el-input>
      </el-form-item>
      <el-form-item label="APP引用的appid">
        <el-input v-model="ruleForm.appid"></el-input>
      </el-form-item>
      <el-form-item label="微信支付分配的微信商户号">
        <el-input v-model="ruleForm.mch_id"></el-input>
      </el-form-item>
      <el-form-item label="微信支付签名秘钥">
        <el-input v-model="ruleForm.key"></el-input>
      </el-form-item>
      <el-form-item label="客户端证书路径">
        <el-input v-model="ruleForm.cert_client"></el-input>
      </el-form-item>
      <el-form-item label="客户端秘钥路径">
        <el-input v-model="ruleForm.cert_key"></el-input>
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
        title: 'wechat ',
        ruleForm: {
          "app_id": "",   //公众号APPID
          "miniapp_id": "",   //小程序APPID
          "appid": "",   //APP 引用的 appid
          "mch_id": "",   //微信支付分配的微信商户号
          "key": "",   //微信支付签名秘钥
          "cert_client": "",   //客户端证书路径
          "cert_key": "",   //客户端秘钥路径
        }, // 编辑页面表单数据
      }
    },
    created() {
      this.get_data()
    },
    methods: {
      // 获取数据
      get_data() {
        axiox.post(this.getApi('root/auth/config_page'),
          `title=wechat`
        ).then(res => {
          if (res.data.code === 0) {
            if (res.data.kv) {
              this.ruleForm = res.data.kv;
            } else {
              this.ruleForm = {
                "app_id": "",   //公众号APPID
                "miniapp_id": "",   //小程序APPID
                "appid": "",   //APP 引用的 appid
                "mch_id": "",   //微信支付分配的微信商户号
                "key": "",   //微信支付签名秘钥
                "cert_client": "",   //客户端证书路径
                "cert_key": "",   //客户端秘钥路径
              }
            }
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
              window.axiox.post(this.getApi('root/auth/config_save'),
                this.dafa({
                  title: this.title,
                  kv: this.ruleForm
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
