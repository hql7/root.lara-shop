<template>
  <!--参数设置-->
  <div class="m-type-list m-prop-box">
    <hint :title="hint.title" :content="hint.content"></hint>
    <h2>参数设置</h2>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px" class="demo-ruleForm">
      <el-form-item label="会员注册方式">
        <el-radio class="radio" v-model="ruleForm.reg_type" label="0">邮箱注册</el-radio>
        <el-radio class="radio" v-model="ruleForm.reg_type" label="1">手机注册</el-radio>
      </el-form-item>
      <el-form-item label="会员注册赠送积分">
        <el-input v-model="ruleForm.reg_integral"></el-input>
      </el-form-item>
      <el-form-item label="一个积分可以抵兑的金额(元)">
        <!--<el-tooltip content="购买商品, 使用积分时: 100时不限制, 为0时不能使用积分, 50时积分抵扣金额不能超过该笔订单应付金额的50%" placement="top">-->
        <el-tooltip content="一个积分抵多少余额" placement="top">
          <el-input v-model="ruleForm.point_money"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="赠送积分占订单金额的比例(%)">
        <el-tooltip content="购买商品,（例） 使用积分时: 100时不限制, 为0时不能使用积分, 50时积分抵扣金额不能超过该笔订单应付金额的50%" placement="top">
          <el-input v-model="ruleForm.point_percent"></el-input>
        </el-tooltip>
      </el-form-item>
      <!--<el-form-item label="最少提现金额">-->
      <!--<el-input v-model="ruleForm.withdraw_min"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="订单作废时长(分钟)">
        <el-tooltip content="自下单之时起，用户在多长时间内没有支付，订单将自动作废" placement="top">
          <el-input v-model="ruleForm.order_cancel"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="发货后多少天自动收货(天)">
        <el-input v-model="ruleForm.auto_receipt"></el-input>
      </el-form-item>
      <el-form-item label="收货多少天后自动好评(天)">
        <el-input v-model="ruleForm.good_review"></el-input>
      </el-form-item>
      <el-form-item label="申请售后的时间段(天)">
        <el-tooltip content="（交易完成多少天内），换货或维修" placement="top">
          <el-input v-model="ruleForm.service_day"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="发票功能是否开启">
        <el-switch
          v-model="ruleForm.open_invoice"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="发票税率(%)">
        <el-tooltip content="确认订单, 索要发票时收取的手续费率，例： 100时不限制, 为0时不收税金, 50时表示收取订单原价50%的税金" placement="top">
          <el-input v-model="ruleForm.tax_invoice"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确 认</el-button>
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
          content: `网站全局基本设置，商城及其他模块相关内容在其各自栏目设置项内进行操作。`
        }, // 提示模块参数
        title: 'shopping',
        ruleForm: {
          reg_type: '',
          reg_integral: '',
          point_money: '',
          point_percent: '',
//          withdraw_min: '',
          open_invoice: '',
          tax_invoice: '',
          order_cancel: '',
          auto_receipt: '',
          order_settle: '',
          service_day: ''
        }, // 编辑页面表单数据
        rules: {
          name: [
            {required: true, message: '不可为空', trigger: 'blur'}
          ]
        } // 验证规则
      }
    },
    created() {
      this.get_data()
    },
    methods: {
      get_data() {
        axiox.post(this.getApi('root/auth/config_page'),
          `title=shopping`
        ).then(res => {
          if (res.data.code === 0) {
            if (res.data.kv) {
              this.ruleForm = res.data.kv
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
              axiox.post(this.getApi('root/auth/config_save'),
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
</style>
