<template>
  <!--支付宝支付配置-->
  <div class="m-type-list m-prop-box">
    <hint :title="hint.title" :content="hint.content"></hint>
    <el-form :model="ruleForm" ref="ruleForm" label-width="240px" class="demo-ruleForm">
      <h1 class="font">支付宝支付配置</h1>
      <el-form-item label="应用ID">
        <el-input v-model="ruleForm.app_id"></el-input>
      </el-form-item>
      <el-form-item label="支付宝公钥">
        <el-input type="textarea" :rows="10" v-model="ruleForm.ali_public_key"></el-input>
      </el-form-item>
      <el-form-item label="应用私钥">
        <el-input type="textarea" :rows="10" v-model="ruleForm.private_key"></el-input>
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
        title: 'alipay',
        ruleForm: {
          app_id: '',
          ali_public_key: '',
          private_key: '',
        }, // 编辑页面表单数据
      }
    },
    created() {
      this.get_data()
    },
    methods: {
      get_data() {
        axiox.post(this.getApi('root/auth/config_page'),
          `title=alipay`
        ).then(res => {
          if (res.data.code === 0) {
            if (res.data.kv) {
              this.ruleForm = res.data.kv;
              this.ruleForm.ali_public_key = this.base().utf8to16(this.base().base64decode(res.data.kv.ali_public_key));
              this.ruleForm.private_key = this.base().utf8to16(this.base().base64decode(res.data.kv.private_key))
            } else {
              this.ruleForm = {
                app_id: '',
                ali_public_key: '',
                private_key: '',
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
        this.ruleForm.ali_public_key = this.base().base64encode(this.base().utf16to8(this.ruleForm.ali_public_key));
        this.ruleForm.private_key = this.base().base64encode(this.base().utf16to8(this.ruleForm.private_key));
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
