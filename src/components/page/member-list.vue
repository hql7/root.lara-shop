<template>
  <div class="member-list prop-box">
    <!--会员列表-->
    <div class="m-member-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>会员列表
        <el-button type="text" icon="plus" size="small" class="add-member-btn add-btn"
                   @click="edit_member('')">添加会员
        </el-button>
        <el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="out_data('','')">
          导出数据
        </el-button>
        <div class="u-right">
          <el-select class="sele-s" v-model="vip" @visible-change="get_vip" placeholder="会员等级"
                     :clearable="true">
            <el-option
              v-for="item in vipObjs"
              :key="item.name"
              :label="item.name"
              :value="item.slug"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="status" placeholder="账号状态" :clearable="true">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
            <el-option label="冻结" value="2"></el-option>
            <el-option label="禁用+冻结" value="3"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
            <el-option label="用户名" value="0"></el-option>
            <el-option label="真实姓名" value="1"></el-option>
            <el-option label="联系电话" value="2"></el-option>
            <el-option label="邮箱地址" value="3"></el-option>
            <el-option label="手机号码" value="4"></el-option>
          </el-select>
          <el-input placeholder="搜索关键词" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_member"></el-button>
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
                <el-dropdown-item command="4"><i class="iconfont icon-wancheng1 c-danger"></i>编辑
                </el-dropdown-item>
                <el-dropdown-item command="0"><i class="iconfont icon-chongzhi1 c-danger"></i>&nbsp;充值
                </el-dropdown-item>
                <!--<el-dropdown-item command="1"><i class="iconfont icon-tuikuan2 c-danger"></i>&nbsp;退款-->
                <!--</el-dropdown-item>-->
                <el-dropdown-item command="2"><i class="iconfont icon-tixian c-danger"></i>&nbsp;扣款
                </el-dropdown-item>
                <!--<el-dropdown-item-->
                <!--v-if="tableData[scope.$index].status != 2 && tableData[scope.$index].status != 3"-->
                <!--command="3"><i class="iconfont icon-zichan c-danger"></i>&nbsp;冻结-->
                <!--</el-dropdown-item>-->
                <!--<el-dropdown-item-->
                <!--v-if="tableData[scope.$index].status == 2 || tableData[scope.$index].status == 3"-->
                <!--command="7"><i class="iconfont icon-zhengque c-danger"></i>&nbsp;解冻-->
                <!--</el-dropdown-item>-->
                <el-dropdown-item
                  command="3"><i class="iconfont icon-zichan c-danger"></i>&nbsp;冻结
                </el-dropdown-item>
                <el-dropdown-item
                  command="7"><i class="iconfont icon-zhengque c-danger"></i>&nbsp;解冻
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.status != 1 && scope.row.status != 3"
                  command="5"><i class="iconfont icon-jinzhi c-danger"></i>&nbsp;禁用
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.status == 1 || scope.row.status == 3"
                  command="8"><i class="iconfont icon-zhengque c-danger"></i>&nbsp;解禁
                </el-dropdown-item>
                <el-dropdown-item command="6"><i class="iconfont icon-shanchu c-danger"></i>&nbsp;加入回收站
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="realname"
          label="真实姓名"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="账户余额"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="freeze_balance"
          label="冻结资金"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="point"
          label="积分"
          min-width="90">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="联系电话"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="vip"
          label="会员等级"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="账号状态"
          min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">禁用</span>
            <span v-else-if="scope.row.status==2">冻结</span>
            <span v-else-if="scope.row.status==3">禁用+冻结</span>
            <span v-else>正常</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="reg_time"
          label="注册日期"
          min-width="160">
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_member('all')">加入回收站
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--添加会员-->
    <div class="add-member prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="repassword"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="会员等级" prop="vip">
          <el-select v-model="ruleForm.vip" @visible-change="get_vip" placeholder="请选择"
                     :clearable="true">
            <el-option
              v-for="item in vipObjs"
              :key="item.name"
              :label="item.name"
              :value="item.slug"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="账号状态" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择">
            <el-option label="正常" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
            <el-option label="冻结" :value="2"></el-option>
            <el-option label="禁用+冻结" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户余额">
          {{ruleForm.balance}}
        </el-form-item>
        <el-form-item label="冻结资金">
          {{ruleForm.freeze_balance}}
        </el-form-item>
        <el-form-item label="积分">
          {{ruleForm.point}}
        </el-form-item>
        <el-form-item label="最近登陆时间">
          {{ruleForm.login_time}}
        </el-form-item>
        <el-form-item label="注册时间">
          {{ruleForm.reg_time}}
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="ruleForm.realname"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio class="radio" v-model="ruleForm.sex" :label="0">女</el-radio>
          <el-radio class="radio" v-model="ruleForm.sex" :label="1">男</el-radio>
          <el-radio class="radio" v-model="ruleForm.sex" :label="2">保密</el-radio>
        </el-form-item>
        <el-form-item label="出生日期">
          <!--<el-input v-model="ruleForm.birthday"></el-input>-->
          <div class="block">
            <el-date-picker
              v-model="ruleForm.birthday"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期"
              @change="choice_time">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="地区">
          <el-col :span="4">
            <el-form-item prop="province_id">
              <el-select v-model="province_id" placeholder="请选择" @visible-change="get_province"
                         @change="get_city">
                <el-option
                  v-for="item in province"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="city_id">
              <el-select v-model="city_id" placeholder="请选择" @change="get_county">
                <el-option
                  v-for="item in city"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="county_id">
              <el-select v-model="county_id" placeholder="请选择">
                <el-option
                  v-for="item in county"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="ruleForm.addr"></el-input>
        </el-form-item>
        <el-form-item label="固话">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--操作-->
    <el-dialog
      :title="to_do_title"
      :visible.sync="dialogVisible">
      <div class="cao-zuo" v-if="to_do==0 ||to_do==1 ||to_do==2">
        <el-select v-model="wallet_type" placeholder="请选择支付">
          <el-option label="账户余额" :value="0"></el-option>
          <el-option label="购物积分" :value="1"></el-option>
        </el-select>
        <el-input v-model="money" placeholder="请输入变动金额数值"></el-input>
      </div>
      <p v-else-if="to_do==5 || to_do==8"><i class="iconfont icon-cuowu c-danger"></i>&nbsp;&nbsp;是否确认进行此项操作？</p>
      <div v-else>
        <el-input v-model="money" placeholder="请输入变动金额数值"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="to_do_ok">保 存</el-button>
      </span>
    </el-dialog>
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
          content: `通过会员管理，你可以进行查看、编辑会员资料等操作,你可以根据条件搜索会员，然后选择相应的操作。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        vip: '', // 会员等级名称
        vipObjs: [], //所有会员等级
        status: null, // 账号状态  0=正常 1=禁用 2=冻结 3=禁用+冻结  (禁用是禁止登录 冻结是禁止操作资金)
        search_type: '', // 搜索类型  0=用户名 1=真实姓名 2=联系电话 3=邮箱地址 4=手机号码
        search_str: '', // 搜索内容
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出分类编辑页面
        crumb: {
          from: '会员列表',
          now: '编辑会员'
        }, // 面包屑模块参数
        ruleForm: {
          username: '',
          email: '',
          vip: '',
          status: null,
          balance: '',
          freeze_balance: '',
          point: '',
          login_time: '',
          reg_time: '',
          realname: '',
          sex: 0,
          addr: '',
          phone: '',
          mobile: '',
          birthday: '',
        }, // 编辑页面表单数据
        password: '',
        repassword: '',
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          vip: [
            {required: true, message: '请选择会员等级'}
          ],
          status: [
            {required: true, message: '请选择账号状态'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
          ]
        }, // 验证规则
        next: false, // 加载完成后开启地址选择权限
        province_id: '', // 省份id
        province: [], // 省份
        city_id: '', // 城市
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
        birthday: '',
        id: '', // 所编辑
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_member()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_member()
      },
      // 获取商品规格列表
      get_member() {
        window.axiox.post(this.getApi('root/auth/user_list'),
          this.dafa({
            index: this.index,
            is_del: 0,
            search_str: this.search_str,
            vip: this.vip,
            status: this.status || '',
            search_type: this.search_type
          })
        ).then(res => {
          this.loading = false
          if (res.data.code === 0
          ) {
            this.tableData = res.data.list;
            this.totalPage = res.data.fy_pgCount
          }
          else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message('对不起！请稍后再试')
        })
      },
      // 操作
      handle(val, id) {
        this.to_do = val;
        this.id = id;
        if (val != 4 && val != 6) {
          this.dialogVisible = true
        }
        switch (val) {
          case '0':
            this.to_do_title = '充值';
            this.act_type_money = 0;
            break;
          case '1':
            this.to_do_title = '退款';
            this.act_type_money = 2;
            break;
          case '2':
            this.to_do_title = '扣款';
            this.act_type_money = 1;
            break;
          case '3':
            this.to_do_title = '冻结';
            this.act_type_status = 2;
            break;
          case '4':
            this.edit_member(id);
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
            break;
        }
      },
      // 操作结束
      to_do_ok() {
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
                if (res.data.code === 0) {
                  this.dialogVisible = false;
                  this.$message(res.data.msg);
                  this.money = '';
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
                act_type: this.act_type_status,
                money: this.money
              })
            ).then(res => {
                if (res.data.code === 0) {
                  this.dialogVisible = false;
                  this.$message(res.data.msg);
                  this.get_member()
                }
                else {
                  this.$message(res.data.msg)
                }
              }
            ).catch(err => {
              this.$message('对不起！请稍后再试')
            });
            break;
          case'6':
            this.del_spec();
            break;
          case'4':
            this.edit_member();
            break;
        }
      },
      // 编辑会员
      edit_member(id) {
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/user_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.user_info) {
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
                this.vipObjs = [{'slug': res.data.user_info.vip, 'name': res.data.user_info.vip_name}];
              } else {
                this.ruleForm = {
                  username: '',
                  email: '',
                  vip: '',
                  status: null,
                  balance: '',
                  freeze_balance: '',
                  point: '',
                  login_time: '',
                  reg_time: '',
                  realname: '',
                  sex: 0,
                  addr: '',
                  phone: '',
                  mobile: '',
                  birthday: '',
                }
                this.province_id = '';
                this.city_id = '';
                this.county_id = '';
              }
              this.password = '',
                this.repassword = '',
                // 渲染结束再开启地址请求权限
                this.$nextTick(() => {
                  this.next = true
                });
            }
          }).catch((err) => {
            reject(err);
            console.log(err);
            // this.$message('对不起！请稍后再试')
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
      // 打入回收站
      del_member(id) {
        this.$confirm('是否确认将此会员放入回收站?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/user_del'),
              this.dafa({
                id_list: this.del_id,
                real_del: 0
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_member();
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
          this.toggleSelection()
          this.del_id = []
          this.$message({
            type: 'info',
            message: '已取消加入回收站'
          })
        })
      },
      // 获取省份
      get_province(val) {
        if (val) {
          axiox.post(this.getApi('coms/get_area'),
            `id=0`
          ).then(res => {
            if (res.data.code === 0) {
              this.province = res.data.list
            } else {
              this.$message(res.data.msg)
            }
          }).catch(err => {
            this.$message('对不起！请稍后再试')
          })
        }
      },
      // 获取城市
      get_city(val) {
        if (this.next) {
          axiox.post(this.getApi('coms/get_area'),
            `id=${val}`
          ).then(res => {
            if (res.data.code === 0) {
              this.city = res.data.list;
              this.city_id = null;
              this.county_id = null;
              this.ruleForm.city = null;
              this.ruleForm.county = null;
            } else {
              this.$message(res.data.msg)
            }
          }).catch(err => {
            this.$message('对不起！请稍后再试')
          })
        }
      },
      // 获取区县
      get_county(val) {
        if (this.next) {
          axiox.post(this.getApi('coms/get_area'),
            `id=${val}`
          ).then(res => {
            if (res.data.code === 0) {
              this.county = res.data.list;
              this.county_id = null;
              this.ruleForm.county = null
            } else {
              this.$message(res.data.msg)
            }
          }).catch(err => {
            console.log(err);
            this.$message('对不起！请稍后再试')
          })
        }
      },
      //获取会员等级
      get_vip(val) {
        if (val) {
          axiox.post(this.getApi("root/auth/vip_list")
          ).then((res) => {
            if (res.data.code === 0) {
              this.vipObjs = res.data.list;
            } else {
              this.$message(res.data.msg);
            }
          }).catch(err => {
            this.$message('对不起!请稍后再试')
          })
        }
      },
      //获取时间值
      choice_time(val) {
        let start = Date.parse(new Date(val[0]));
        this.birthday = start / 1000;
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              window.axiox.post(this.getApi('root/auth/user_save'),
                this.dafa({
                  user_id: this.id,
                  username: this.ruleForm.username,
                  password: this.password,
                  repassword: this.repassword,
                  email: this.ruleForm.email,
                  vip: this.ruleForm.vip,
                  status: this.ruleForm.status,
                  realname: this.ruleForm.realname,
                  sex: this.ruleForm.sex,
                  birthday: !this.birthday ? new Date(this.ruleForm.birthday.replace(/-/g, '/')).getTime().toString().substr(0, 10) : this.birthday,
                  province: !this.province_id ? '' : this.province_id,
                  city: !this.city_id ? '' : this.city_id,
                  county: !this.county_id ? '' : this.county_id,
                  addr: this.ruleForm.addr,
                  phone: this.ruleForm.phone,
                  mobile: this.ruleForm.mobile
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_member()
                }
              }).catch(err => {
                reject(err);
                // this.$message('对不起！请稍后再试 错误信息已在控制台打印')
              })
            })
          } else {
            this.$message('请检查填写信息是否有误');
            return false
          }
        })
      },
      // 导出数据
      out_data() {
        let that = this;
        axiox.post(this.getApi('root/auth/user_export')
        ).then(function (res) {
          if (res.data.code == 0) {
            location.href = res.data.msg;
          } else {
            that.$message(res.data.msg)
          }
        }).catch(function () {
          that.$message('对不起！请稍后再试')
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
