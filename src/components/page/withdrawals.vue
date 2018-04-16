<template>
  <div class="withdrawals prop-box">
    <!--提现申请列表-->
    <div class="m-withdrawals-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>提现申请列表
        <!--<el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_member('','')">添加会员
        </el-button>-->
        <div class="u-right">
          <el-select class="sele-s" v-model="type" placeholder="提现方式" :clearable="true">
            <el-option label="支付宝" value="0"></el-option>
            <el-option label="微信" value="1"></el-option>
            <el-option label="银行卡" value="2"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="status" placeholder="处理状态" :clearable="true">
            <el-option label="等待处理" value="0"></el-option>
            <el-option label="同意" value="1"></el-option>
            <el-option label="拒绝" value="2"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
            <el-option label="用户名" value="0"></el-option>
            <el-option label="收款账号" value="1"></el-option>
            <el-option label="开户人姓名" value="2"></el-option>
            <el-option label="联系方式" value="3"></el-option>
          </el-select>
          <el-input placeholder="搜索关键词" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_withdrawals"></el-button>
          </el-input>
        </div>
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
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-dropdown @command="handle($event,scope.row.id)">
              <el-button type="primary" size="small">
                处理<i class="el-icon-setting el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="i-box">
                <el-dropdown-item command="0" v-if="scope.row.status==0"><i
                  class="iconfont icon-wancheng1 c-danger"></i>&nbsp;审批
                </el-dropdown-item>
                <el-dropdown-item command="1"
                                  v-if="scope.row.status==1 || scope.row.status==2"><i
                  class="iconfont icon-shanchu3 c-danger"></i>&nbsp;删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="提现金额"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="tax"
          label="提现手续费"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="real_amount"
          label="实际到账"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="account_type"
          label="收款名称"
          min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.account_type==0">支付宝</span>
            <span v-else-if="scope.row.account_type==1">微信</span>
            <span v-else>银行卡</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="account_no"
          label="收款账号"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="account_name"
          label="开户人"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="apply_time"
          label="申请时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="handling_idea"
          label="处理意见"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="handling_time"
          label="处理时间"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1" class="c-success">同意 </span>
            <span v-else-if="scope.row.status==2" class="c-999">拒绝</span>
            <span v-else class="c-blue">等待处理</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_withdrawals('all', '')">删除
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--审批-->
    <div class="add-member prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="用户名" prop="username">
          {{ruleForm.username}}
        </el-form-item>
        <el-form-item label="账户余额" prop="balance">
          {{ruleForm.balance}}
        </el-form-item>
        <el-form-item label="提现金额">
          {{ruleForm.amount}}
        </el-form-item>
        <el-form-item label="提现手续费">
          {{ruleForm.tax}}
        </el-form-item>
        <el-form-item label="实际到账">
          {{ruleForm.real_amount}}
        </el-form-item>
        <el-form-item label="申请时间">
          {{ruleForm.apply_time}}
        </el-form-item>
        <el-form-item label="收款名称">
          <span v-if="ruleForm.account_type==0">支付宝</span>
          <span v-else-if="ruleForm.account_type==1">微信</span>
          <span v-else>银行卡</span>
        </el-form-item>
        <el-form-item label="收款账号">
          {{ruleForm.account_no}}
        </el-form-item>
        <el-form-item label="开户人姓名">
          {{ruleForm.account_name}}
        </el-form-item>
        <el-form-item label="处理结果">
          <el-radio class="radio" v-model="radio" label="0">同意</el-radio>
          <el-radio class="radio" v-model="radio" label="1">拒绝</el-radio>
        </el-form-item>
        <el-form-item label="处理意见">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="textarea">
          </el-input>
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
  import page from '../common/page.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `提现申请， 由总平台审核与管理。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        type: '', // 提现方式 0=支付宝 1=微信 2=银行卡
        status: '', // 处理状态 0=等待处理 1=同意 2=拒绝
        search_type: '', // 搜索类型 0=用户名 1=收款账号 2=开户人姓名 3=联系方式
        search_str: '', // 搜索内容
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '提现申请',
          now: '审批'
        }, // 面包屑模块参数
        ruleForm: {
          'id': null,
          'username': '',
          'balance': '',
          'amount': '',
          'tax': '',
          'real_amount': '',
          'account_type': '',
          'account_name': '',
//          'account_tel': '',
        }, // 编辑页面表单数据
        next: false, // 加载完成后开启地址选择权限
        province_id: '', // 省份id
        province: [], // 省份
        city_id: '', // 城市id
        city: [], // 城市
        county_id: '', // 区县id
        county: [], // 区县
        dialogVisible: false, // 是否弹出
        to_do: '', // 操作值 0=充值 1=退款 2=扣款 3=冻结 4=编辑 5=禁用 6=删除 7=解冻 8=解禁
        act_type_money: '', // 金额变动操作类型   0=充值 1=扣款 2=退款
        act_type_status: '', // 状态变动操作 0=禁用会员 1=解禁会员 2=冻结会员 3=解冻会员
        wallet_type: 0, // 钱包类型  0=账户余额 1=购物积分  退款操作时默认退款到账户余额
        to_do_title: '', // 弹出组件标题
        money: '', // 变动金额
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        radio: '0',
        textarea: '',
        loading: true,
        rules: {
          textarea: [
            {required: true, message: '处理意见必须填写', trigger: 'blur'}
          ]
        },//验证规则
      }
    },
    created() {
      this.get_withdrawals()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_withdrawals()
      },
      // 获取提现列表
      get_withdrawals() {
        window.axiox.post(this.getApi('root/auth/withdraw_list'),
          this.dafa({
            index: this.index,
            search_str: this.search_str,
            type: this.type,
            status: this.status,
            search_type: this.search_type
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.list;
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
      },
      // 操作
      handle(val, id) {
        this.to_do = val;
        this.id = id;
        switch (val) {
          case '0':
            this.edit_withdrawals();
            break;
          case '1':
            this.del_withdrawals();
            break;
        }
      },
      // 审批
      edit_withdrawals() {
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/withdraw_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              this.ruleForm = res.data.info;

              // 渲染结束再开启地址请求权限
              this.$nextTick(() => {
                this.next = true
              })
            }
          }).catch((err) => {
            reject(err);
            console.log(err);
          })
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
      del_withdrawals(id) {
        this.$confirm('是否确认删除申请单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (id === 'all') {
            this.multipleSelection.forEach(item => {
              this.del_id.push(item.id)
            })
          } else {
            this.del_id.push(this.id)
          }

          this.antiShake.antiShake((resolve, reject) => {
            window.axiox.post(this.getApi('root/auth/withdraw_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_withdrawals();
              } else {
                this.toggleSelection();
              }
            }).catch((err) => {
              reject(err);
              console.log(err);
              this.toggleSelection();
              this.del_id = []
            })
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
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/withdraw_save'),
                this.dafa({
                  id: this.id,
                  type: this.radio,
                  handling_idea: this.textarea,
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_withdrawals()
                }
              }).catch(err => {
                reject(err);
              })
            })
          } else {
            this.$message('请检查填写信息是否有误');
            return false
          }
        })
      }
    },
    computed: {
      index() {
        return this.$store.state.index
      }
    },
    components: {
      hint, crumb, page
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .cao-zuo .el-select {
    width: 100%;
    margin-bottom: 20px;
  }
</style>
