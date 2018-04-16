<template>
  <div id="login" class="login" @keyup.enter="submitForm('ruleForm')" v-loading="loading">
    <div class="login-form">
      <div class="login-form-img"><p></p></div>
      <div class="login-form-content">
        <h2>管理员登录</h2>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="act">
            <el-input v-model="ruleForm.act" placeholder="请输入账号">
              <template slot="prepend"><i class="iconfont icon-yonghu1"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input v-model="ruleForm.pass" placeholder="请输入密码" type="password">
              <template slot="prepend"><i class="iconfont icon-password1"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="ruleForm.code" placeholder="请输入验证码" class="login-form-yzm"></el-input>
            <img :src="yzm_code" alt="验证码" @click="change_yzm" class="yzm_code">
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="submitForm('ruleForm')"
                       class="login-btn">登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        yzm_code: this.getApi('coms/admin-code'),
        ruleForm: {
          act: '',
          pass: '',
          code: ''
        },
        rules: {
          act: [
            {validator: this.va.vaAct, trigger: 'blur'}
          ],
          pass: [
            {min: 10, max: 18, message: '长度 10 到 18 个字符', trigger: 'blur'},
            {validator: this.va.vaPass, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {min: 5, max: 5, message: '长度 5 个字符', trigger: 'blur'}
          ]
        },
        loading: false
      }
    },
    created() {
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            window.axiox.post(this.getApi('root/login-act'),
              this.dafa({
                username: this.ruleForm.act,
                userpass: this.ruleForm.pass,
                yzm: this.ruleForm.code
              })
            ).then(res => {
              this.loading = false;
              if (res.data.code === 0) {
                sessionStorage.setItem('user', JSON.stringify({id: res.data.id, name: res.data.name}));
                this.$message(res.data.msg);
                this.$router.push('/home')
              } else {
                this.$message(res.data.msg);
                this.change_yzm()
              }
            }).catch(err => {
              this.loading = false;
              this.$message('请重试');
            })
          } else {
            this.$message('请检查填写信息是否有误');
            return false
          }
        })
      },
      change_yzm() {
        this.yzm_code = this.getApi('coms/admin-code') + '?code=' + Math.random();
        this.ruleForm.code = null
      }
    },
    components: {}
  }
</script>

<style scoped>
  .login {
    background: url("../../../static/img/login_bj.jpg") no-repeat;
    background-size: 100% 100%;
    position: fixed;
    width: 100%;
    height: 100%;
    min-width: 1400px;
  }

  .login-form {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 900px;
    height: 350px;
    border: 6px solid rgba(69, 166, 219, .7);
    -ms-border: 6px solid #3ea1db;
    border-radius: 7px;
  }

  .login-form > div {
    float: left;
    height: 100%;
  }

  .login-form-img {
    width: 415px;
    background: #fff url("../../../static/img/lg-fr-img.png") center no-repeat;
  }

  .login-form-img p {
    width: 22px;
    height: 100%;
    float: right;
    background: url("../../../static/img/s-t.jpg");
  }

  .login-form-content {
    width: 485px;
    background-color: #fff;
    padding: 17px 55px;
    box-sizing: border-box;
  }

  .login-form-content > h2 {
    height: 50px;
    line-height: 50px;
    font-size: 24px;
    color: #0067b2;
    border-bottom: 1px solid #c6e1f4;
    margin-bottom: 24px;
  }

  .login-form-yzm {
    width: 232px;
  }

  .yzm_code {
    float: right;
    width: 131px;
    height: 36px;
    border: 1px solid #bfcbd9;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .login-btn {
    width: 100%;
  }
</style>
