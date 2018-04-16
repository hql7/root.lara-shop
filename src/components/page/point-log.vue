<template>
  <div class="member-list prop-box">
    <div class="m-member-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>积分日志列表
        <!--<el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_member('','')">添加会员
        </el-button>-->
        <div class="u-right">
          <el-date-picker
            v-model="date_time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            placeholder="选择时间范围"
            @change="choice_time"
            align="right">
          </el-date-picker>
          <el-select class="sele-s" v-model="type" placeholder="事件类型" :clearable="true">
            <el-option label="下单赠送积分" value="1"></el-option>
            <el-option label="下单消费" value="2"></el-option>
            <el-option label="订单退货" value="3"></el-option>
            <el-option label="退款" value="4"></el-option>
            <el-option label="管理员充值" value="5"></el-option>
            <el-option label="管理员扣款" value="6"></el-option>
            <el-option label="币种转换" value="7"></el-option>
            <el-option label="管理员退款" value="8"></el-option>
          </el-select>
          <el-input placeholder="搜索用户名" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_balance_log"></el-button>
          </el-input>
        </div>
      </h2>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        stripe
        ref="multipleTable">
        <el-table-column
          prop="id"
          label="日志ID"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="时间"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="type"
          label="事件类型"
          min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">下单赠送积分</span>
            <span v-else-if="scope.row.type==2">下单消费</span>
            <span v-else-if="scope.row.type==3">订单退货</span>
            <span v-else-if="scope.row.type==4">退款</span>
            <span v-else-if="scope.row.type==5">管理员充值</span>
            <span v-else-if="scope.row.type==6">管理员扣款</span>
            <span v-else-if="scope.row.type==7">币种转换</span>
            <span v-else>管理员退款</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="point"
          label="积分"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="point_log"
          label="积分快照"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="admin_name"
          label="管理员名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注"
          min-width="320">
        </el-table-column>
      </el-table>
    </div>
    <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  //  import crumb from '../common/crumb.vue'
  import page from '../common/page.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `积分日记全部记录, 由总平台管理。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }, // 时间范围选择
        date_time: '', // 所选时间
        start_time: '', // 起始时间
        end_time: '', // 截止时间
//        wallet_type: '', // 钱包类型 0=账户余额 1=购物积分
        type: '', // 事件类型 0=订单支付 1=用户充值 2=管理员充值 3=提现 4=转账 5=管理员扣款 6=管理员退款
//        status: '', // 账号状态  0=正常 1=禁用 2=冻结 3=禁用+冻结  (禁用是禁止登录 冻结是禁止操作资金)
//        search_type: '', // 搜索类型  0=用户名 1=真实姓名 2=联系电话 3=邮箱地址 4=手机号码
        search_str: '', // 搜索内容
//        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        loading: true,
//        add_show: false, // 是否弹出分类编辑页面
        /*   crumb: {
         from: '会员列表',
         now: '编辑会员'
         }, // 面包屑模块参数*/
//        ruleForm: {}, // 编辑页面表单数据
        /*  rules: {
         name: [
         {required: true, message: '请输入分类名称', trigger: 'blur'}
         ],
         sort: [
         {required: true, message: '不能为空'},
         {type: 'number', message: '必须为数字值'}
         ]
         }, // 验证规则*/
//        next: false, // 加载完成后开启地址选择权限
//        province_id: '', // 省份id
//        province: [], // 省份
//        city_id: '', // 城市id
//        city: [], // 城市
//        county_id: '', // 区县id
//        county: [], // 区县
//        dialogVisible: false, // 是否弹出
//        to_do: '', // 操作值 0=充值 1=退款 2=扣款 3=冻结 4=编辑 5=禁用 6=删除 7=解冻 8=解禁
//        act_type_money: '', // 金额变动操作类型   0=充值 1=扣款 2=退款
//        act_type_status: '', // 状态变动操作 0=禁用会员 1=解禁会员 2=冻结会员 3=解冻会员
//        wallet_type: 0, // 钱包类型  0=账户余额 1=购物积分  退款操作时默认退款到账户余额
//        to_do_title: '', // 弹出组件标题
//        money: '', // 变动金额
//        ruleForm_cao_zuo: {}, // 操作表单
//        rules_cao_zuo: [], // 操作验证
//        id: '', // 所编辑id
//        del_id: [] // 删除储存数组
      }
    },
    created() {
      this.get_balance_log()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      /* go_back () {
       this.add_show = false
       },*/
      // 监听子分页组件 翻页
      to_page() {
        this.get_balance_log()
      },
      // 获取资金日志列表
      get_balance_log() {
        window.axiox.post(this.getApi('root/auth/point_log'),
          this.dafa({
            index: this.index,
            begin_time: this.start_time,
            end_time: this.end_time,
//            wallet_type: this.wallet_type,
            type: this.type,
            username: this.search_str
          })
        ).then(res => {
          this.loading = false
          if (res.data.code === 0) {
            this.tableData = res.data.list;
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message('对不起！请稍后再试')
        })
      },
      // 选择时间处理数据格式
      choice_time(val) {
        // let start = Date.parse(new Date(val.substr(0, 19)));
        // let end = Date.parse(new Date(val.substr(22, 19)));
        let start = Date.parse(new Date(val[0]));
        let end = Date.parse(new Date(val[1]));
        this.start_time = start / 1000;
        this.end_time = end / 1000;
      }
      // 操作
      /*handle (val, id){
       //        this.to_do = val;
       this.id = id;
       /!*if (val != 4 && val != 6) {
       this.dialogVisible = true
       }*!/
       switch (val) {
       case '0':
       this.return_member();
       break;
       case '1':
       this.del_member();
       break;
       /!*  case '2':
       this.to_do_title = '扣款';
       this.act_type_money = 1;
       break;*!/
       /!*       case '3':
       this.to_do_title = '冻结';
       this.act_type_status = 2;
       break;
       case '4':
       this.edit_member();
       break;
       case '5':
       this.to_do_title = '禁用';
       this.act_type_status = 0;
       break;
       case '6':
       this.del_member();
       break;
       case '7':
       this.to_do_title = '解冻';
       this.act_type_status = 3;
       break;
       case '8':
       this.to_do_title = '解禁';
       this.act_type_status = 1;
       break;*!/
       }
       },*/
      // 操作结束
      /*to_do_ok (){
       switch (this.to_do) {
       case '0':
       case '1':
       case '2':
       if (this.money) {
       axiox.post(this.getApi('root/auth/customer_save'),
       this.dafa({
       user_id: this.id,
       act_type: this.act_type_money,
       wallet_type: this.wallet_type,
       money: this.money
       })
       ).then(res => {
       if (res.data.code == 0) {
       this.dialogVisible = false;
       this.get_member()
       } else {
       this.$message(res.data.msg)
       }
       }).catch(err => {
       this.$message('对不起！请稍后再试')
       })
       } else {
       this.$message('请输入金额')
       }
       break;
       case '3':
       case '5':
       case '7':
       case '8':
       axiox.post(this.getApi('root/auth/user_status'),
       this.dafa({
       user_id: this.id,
       act_type: this.act_type_status
       })
       ).then(res => {
       if (res.data.code == 0) {
       this.dialogVisible = false;
       this.get_member()
       } else {
       this.$message(res.data.msg)
       }
       }).catch(err => {
       this.$message('对不起！请稍后再试')
       });
       break;
       case '6':
       this.del_spec();
       break;
       case '4':
       this.edit_member();
       break;
       }
       },*/
      // 编辑会员
      /*edit_member () {
       //        this.id = index === '' ? '' : rows[index].id
       window.axiox.post(this.getApi('root/auth/user_edit'),
       `id=${this.id}`
       ).then(res => {
       if (res.data.code === 0) {
       this.add_show = true;
       this.ruleForm = res.data.user_info;
       // 处理省市县数据格式
       this.province_id = res.data.user_info.province.id;
       this.province.push({
       id: res.data.user_info.province.id,
       name: res.data.user_info.province.name,
       });
       this.city_id = res.data.user_info.city.id;
       this.city.push({
       id: res.data.user_info.city.id,
       name: res.data.user_info.city.name,
       });
       this.county_id = res.data.user_info.county.id;
       this.county.push({
       id: res.data.user_info.county.id,
       name: res.data.user_info.county.name,
       });

       // 渲染结束再开启地址请求权限
       this.$nextTick(() => {
       this.next = true
       })
       } else {
       this.$message(res.data.msg)
       }
       }).catch((err) => {
       console.log(err)
       this.$message('对不起！请稍后再试')
       })
       },*/
      /*  // 取消选择
       toggleSelection (rows) {
       if (rows) {
       rows.forEach(row => {
       this.$refs.multipleTable.toggleRowSelection(row)
       })
       } else {
       this.$refs.multipleTable.clearSelection()
       }
       },
       // 收集选中列
       handleSelectionChange (val) {
       this.multipleSelection = val
       },*/
      // 删除会员
      /*del_member (index) {
       this.$confirm('是否确认将此会员彻底删除?', '提示', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
       }).then(() => {
       if (index === 'all') {
       this.multipleSelection.forEach(item => {
       this.del_id.push(item.id)
       })
       } else {
       this.del_id.push(this.id)
       }

       window.axiox.post(this.getApi('root/auth/user_del'),
       this.dafa({
       id_list: this.del_id,
       real_del: 1
       })
       ).then(res => {
       if (res.data.code === 0) {
       this.get_member();
       this.$message(res.data.msg);
       this.del_id = []
       } else {
       this.$message(res.data.msg);
       this.toggleSelection();
       this.del_id = []
       }
       }).catch((err) => {
       console.log(err);
       this.$message('对不起！请稍后再试');
       this.toggleSelection();
       this.del_id = []
       })
       }).catch(() => {
       this.toggleSelection();
       this.del_id = [];
       this.$message({
       type: 'info',
       message: '已取消删除'
       })
       })
       },*/
      // 恢复会员
      /*return_member (index) {
       this.$confirm('是否确认将此会员从回收站恢复?', '提示', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
       }).then(() => {
       if (index === 'all') {
       this.multipleSelection.forEach(item => {
       this.del_id.push(item.id)
       })
       } else {
       this.del_id.push(this.id)
       }

       window.axiox.post(this.getApi('root/auth/user_recover'),
       this.dafa({
       id_list: this.del_id
       })
       ).then(res => {
       if (res.data.code === 0) {
       this.get_member();
       this.$message(res.data.msg);
       this.del_id = []
       } else {
       this.$message(res.data.msg);
       this.toggleSelection();
       this.del_id = []
       }
       }).catch((err) => {
       console.log(err);
       this.$message('对不起！请稍后再试');
       this.toggleSelection();
       this.del_id = []
       })
       }).catch(() => {
       this.toggleSelection();
       this.del_id = [];
       this.$message({
       type: 'info',
       message: '已取消删除'
       })
       })
       },*/
      /* // 获取省份
       get_province (val){
       if (val) {
       axiox.post(this.getApi('coms/get_area'),
       `id=0`
       ).then(res => {
       if (res.data.code == 0) {
       this.province = res.data.list
       } else {
       this.$message(res.data.msg)
       }
       }).catch(err => {
       //            console.log(err);
       this.$message('对不起！请稍后再试')
       })
       }
       },
       // 获取城市
       get_city (val){
       if (this.next) {
       axiox.post(this.getApi('coms/get_area'),
       `id=${val}`
       ).then(res => {
       if (res.data.code == 0) {
       this.city = res.data.list;
       this.city_id = null;
       this.county_id = null;
       this.ruleForm.city = null;
       this.ruleForm.county = null;
       } else {
       this.$message(res.data.msg)
       }
       }).catch(err => {
       //            console.log(err);
       this.$message('对不起！请稍后再试')
       })
       }
       },
       // 获取区县
       get_county (val){
       if (this.next) {
       axiox.post(this.getApi('coms/get_area'),
       `id=${val}`
       ).then(res => {
       if (res.data.code == 0) {
       this.county = res.data.list;
       this.county_id = null;
       this.ruleForm.county = null
       } else {
       this.$message(res.data.msg)
       }
       }).catch(err => {
       //            console.log(err);
       this.$message('对不起！请稍后再试')
       })
       }
       },*/
      /* // 删除规格值
       del_spec_value(id, key) {
       let arr = [];
       this.ruleForm.value.forEach(item => {
       if (item.id != id || item.key != key) {
       arr.push(item);
       }
       })
       this.ruleForm.value = arr;
       },*/
      // 上传图片
      /*handleRemove (file, fileList) {
       //        console.log(file, fileList) 点击删除时得到的数据
       },*/
      // 点击预览时得到的数据
      /*handlePreview (file) {
       this.dialogImageUrl = file.url
       this.dialogVisible = true
       },*/
      // 图片上传前钩子函数
      /*  beforeImgUpload (file) {
       const isLt2M = file.size / 1024 / 1024 < 2
       let isType = false
       switch (file.type) {
       case 'image/jpeg' :
       isType = true
       break
       case 'image/png' :
       isType = true
       break
       case 'image/gif' :
       isType = true
       break
       }

       if (!isLt2M) this.$message('请选择小于2M的图片')
       if (!isType) this.$message('不支持此图片类型')

       return isType && isLt2M
       },*/
      /*submitForm (formName) {
       this.$refs[formName].validate((valid) => {
       if (valid) {
       window.axiox.post(this.getApi('root/auth/user_save'),
       this.dafa({
       user_id: this.id,
       username: this.ruleForm.username,
       password: this.ruleForm.password,
       repassword: this.ruleForm.repassword,
       email: this.ruleForm.email,
       vip: this.ruleForm.vip,
       status: this.ruleForm.status,
       realname: this.ruleForm.realname,
       sex: this.ruleForm.sex,
       birthday: this.ruleForm.birthday,
       province: this.ruleForm.province_id,
       city: this.ruleForm.city_id,
       county: this.ruleForm.county_id,
       addr: this.ruleForm.addr,
       phone: this.ruleForm.phone,
       mobile: this.ruleForm.mobile
       })
       ).then(res => {
       if (res.data.code == 0) {
       this.$message(res.data.msg)
       this.add_show = false
       this.get_member()
       } else {
       this.$message(res.data.msg)
       }
       }).catch(err => {
       this.$message('对不起！请稍后再试 错误信息已在控制台打印')
       })
       } else {
       this.$message('请检查填写信息是否有误')
       return false
       }
       })
       }*/
    },
    computed: {
      index() {
        return this.$store.state.index
      }
    },
    components: {
      hint, page
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
