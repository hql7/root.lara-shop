<template>
  <!--功能开关设置-->
  <div class="m-type-list m-prop-box">
    <hint :title="hint.title" :content="hint.content"></hint>
    <h2>功能开关设置</h2>
    <el-form :model="ruleForm" ref="ruleForm" label-width="240px" class="demo-ruleForm">
      <el-form-item label="会员注册">
        <el-switch
          v-model="ruleForm.register"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="会员充值">
        <el-switch
          v-model="ruleForm.recharge"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="会员提现">
        <el-switch
          v-model="ruleForm.withdraw"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="币种转换">
        <el-switch
          v-model="ruleForm.transfer"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商城购物">
        <el-switch
          v-model="ruleForm.shopping"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="邮箱开关">
        <el-switch
          v-model="ruleForm.email"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="短信开关">
        <el-switch
          v-model="ruleForm.sms"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="七牛云存储">
        <el-switch
          v-model="ruleForm.qiniu"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button id="switch" type="primary" @click="submitForm('ruleForm')">确 认</el-button>
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
        title: 'switch',
        ruleForm: {
          register: '0',
          recharge: '0',
          withdraw: '0',
          transfer: '0',
          shopping: '0',
          email: '0',
          sms: '0',
          qiniu: '0'
        } // 编辑页面表单数据
      }
    },
    created() {
      this.get_data()
    },
    methods: {
      // 获取数据
      get_data() {
        axiox.post(this.getApi('root/auth/config_page'),
          `title=switch`
        ).then(res => {
          if (res.data.code === 0) {
            if (res.data.kv) {
              this.ruleForm = res.data.kv;
            } else {
              this.ruleForm = {
                register: '0',
                recharge: '0',
                withdraw: '0',
                transfer: '0',
                shopping: '0',
                email: '0',
                sms: '0'
              };
            }
//            this.imageUrl = res.data.kv.logo
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

  .avatar-uploader {
    width: 180px;
    height: 180px;
    padding: 1px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
  }

  #switch {
    margin-left: -70px;
  }
</style>
