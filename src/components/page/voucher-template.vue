<template>
  <div class="member-list prop-box">
    <!--代金券模版-->
    <div class="m-member-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>代金券列表
        <el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_voucher('','')">
          添加代金券模版
        </el-button>
        <div class="u-right">
          <el-input placeholder="搜索模版名称" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_voucher"></el-button>
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
            <el-dropdown @command="handle($event,scope.row.id,scope.row.type)">
              <el-button type="primary" size="small">
                处理<i class="el-icon-setting el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="i-box">
                <el-dropdown-item command="0"><i class="iconfont icon-feiji c-danger"></i>&nbsp;发放</el-dropdown-item>
                <el-dropdown-item command="1"><i class="iconfont icon-wancheng1 c-danger"></i>编辑</el-dropdown-item>
                <el-dropdown-item command="2"><i class="iconfont icon-shanchu4 c-danger"></i>&nbsp;删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="模板名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="type"
          label="代金券类型"
          min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">指定发放</span>
            <span v-else-if="scope.row.type==2">免费领取</span>
            <span v-else-if="scope.row.type==3">线下发放</span>
            <span v-else>下单赠送</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="面额"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="point"
          label="兑换所需积分"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="money"
          label="使用需满金额"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="max_nums"
          label="发放总量"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="send_nums"
          label="已发放数量"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="used_nums"
          label="已使用数量"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="使用开始日期"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="使用截止日期"
          min-width="160">
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_voucher('all', '')">删除
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--添加活动-->
    <div class="add-member prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="代金券类型" prop="type">
          <el-select v-model="ruleForm.type">
            <el-option label="指定发放" :value="1"></el-option>
            <el-option label="免费领取" :value="2"></el-option>
            <el-option label="线下发放" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面额" prop="value">
          <el-input v-model.number="ruleForm.value"></el-input>
        </el-form-item>
        <el-form-item label="兑换所需积分" prop="point">
          <el-input v-model.number="ruleForm.point"></el-input>
        </el-form-item>
        <el-form-item label="使用需满金额" prop="money">
          <el-input v-model.number="ruleForm.money"></el-input>
        </el-form-item>
        <el-form-item label="可发放总数" prop="max_nums">
          <el-input v-model.number="ruleForm.max_nums"></el-input>
        </el-form-item>
        <el-form-item label="使用起始时间" prop="start_time">
          <el-date-picker
            v-model="ruleForm.start_time"
            @change="STIME"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用结束时间" prop="end_time">
          <el-date-picker
            v-model="ruleForm.end_time"
            @change="ETIME"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用方式" prop="use_type">
          <el-select v-model="ruleForm.use_type">
            <el-option label="全店通用" value="0"></el-option>
            <el-option label="指定商品" value="1"></el-option>
            <el-option label="指定分类" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可使用条件" v-if="ruleForm.use_type==1">
          <el-table :data="condition">
            <el-table-column property="good_name" label="商品名称" min-width="260">
              <template slot-scope="scope">
                <a :href="scope.row.good_link" target="_blank">{{scope.row.good_name}}</a>
              </template>
            </el-table-column>
            <!--<el-table-column property="good_link" label="商品链接" min-width="220"></el-table-column>-->
            <el-table-column property="sell_price" label="价格" min-width="100"></el-table-column>
            <el-table-column property="store_nums" label="库存" min-width="100"></el-table-column>
            <el-table-column label="操作" min-width="120">
              <template slot-scope="scope">
                <el-button type="danger" size="small" icon="delete"
                           @click="del_goods_can(scope.$index, condition)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="get_seles_goods">添加商品</el-button>
        </el-form-item>
        <el-form-item label="可使用条件" v-if="ruleForm.use_type==2">
          <el-select v-model="lv1" @visible-change="getLv1" @change="getLv2">
            <el-option v-for="item in level1" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="lv2" @change="getLv3">
            <el-option v-for="item in level2" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="lv3">
            <el-option v-for="item in level3" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <em class="c-danger">只能选择三级分类下面的商品</em>
        </el-form-item>
        <el-form-item label="活动描述" prop="desc">
          <el-input
            type="textarea"
            :rows="2"
            v-model="ruleForm.desc">
          </el-input>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <!--操作-发放-->
    <el-dialog
      title="发放优惠券"
      :visible.sync="dialogVisible_Q"
      width="80%">
      <div v-if="FF_type==1">
        <div class="u-right small-ipt">
          <el-select class="sele-s" v-model="search_type_s" @visible-change="get_vip" placeholder="搜索类型"
                     :clearable="true">
            <el-option label="所有会员" value="0"></el-option>
            <el-option label="店铺关注会员" value="1"></el-option>
            <el-option v-for="item in vipObjs" :label="item.name" :key="item.name" :value="item.slug"></el-option>
          </el-select>
          <el-input placeholder="会员昵称" v-model="search_str_name" class="search"></el-input>
          <el-input placeholder="手机" v-model="mobile" class="search"></el-input>
          <el-input placeholder="邮箱" v-model="email" class="search">

          </el-input>
          <el-button slot="append" icon="el-icon-search" @click="send_voucher"></el-button>
        </div>
        <el-table :data="see_vip_data"
                  @selection-change="handleSelectionChange_Q">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column property="username" label="会员名称" min-width="200"></el-table-column>
          <el-table-column property="vip" label="会员等级名称" min-width="140"></el-table-column>
          <el-table-column property="mobile" label="手机" min-width="160"></el-table-column>
          <el-table-column property="email" label="邮箱" min-width="180"></el-table-column>
        </el-table>
        <div class="see-goods-fy">
          <el-pagination
            @current-change="next_see_goods"
            :current-page="see_index"
            layout="total, prev, pager, next, jumper"
            :page-count="see_pgCount">
          </el-pagination>
        </div>
      </div>
      <div class="send-sum" v-else>
        <ul>
          <li><label>代金券名称 : </label>{{send_info.name}}</li>
          <li><label>代金券面额 : </label>{{send_info.value}}</li>
          <li>
            <label>代金券类型 :</label>
            <span v-if="send_info.type == 1">指定发放</span>
            <span v-else-if="send_info.type == 2">免费领取</span>
            <span v-else>线下发放</span>
          </li>
          <li><label>发放数量 :</label>
            <el-input v-model="send_nums"></el-input>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="send_to">发 放</el-button>
      </span>
    </el-dialog>
    <!--选择商品加入活动-->
    <el-dialog
      title="选择商品"
      :visible.sync="dialogVisible_goods"
      width="80%">
      <div class="u-right">
        <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
          <el-option label="商品编号" value="0"></el-option>
          <el-option label="商品名称" value="1"></el-option>
        </el-select>
        <el-input placeholder="搜索关键词" v-model="search_str_" class="search">
          <el-button slot="append" icon="el-icon-search" @click="get_seles_goods"></el-button>
        </el-input>
      </div>
      <el-table :data="choice_goods_data"
                @selection-change="handleSelectionChange_">

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column property="good_name" label="商品名称" min-width="260">
          <template slot-scope="scope">
            <a :href="scope.row.good_link" target="_blank">{{scope.row.good_name}}</a>
          </template>
        </el-table-column>
        <el-table-column property="sell_price" label="价格" min-width="100"></el-table-column>
        <el-table-column property="store_nums" label="库存" min-width="100"></el-table-column>
      </el-table>
      <div class="see-goods-fy">
        <el-pagination
          @current-change="next_choice_goods"
          :current-page="choice_index"
          layout="total, prev, pager, next, jumper"
          :page-count="choice_pgCount">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add_seles_goods">选 择</el-button>
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
          content: `优惠促销管理, 由平台设置管理。代金券发放总量为0表示不限量。代金券描述请简洁明了，尽量在15字以内描述清楚`
        }, // 提示模块参数
        tableData: [], // 表格数据
        search_str: '', // 搜索活动名
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出编辑页面
        crumb: {
          from: '代金券模版',
          now: '编辑模版'
        }, // 面包屑模块参数
        ruleForm: {
          name: '',
          type: null,
          value: null,
          point: null,
          money: null,
          max_nums: null,
          start_time: '',
          end_time: '',
          desc: '',
          use_type: null
        }, // 编辑页面表单数据
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'}
          ],
          type: [
            {required: true, type: 'number', message: '请选择代金券类型', trigger: 'blur'}
          ],
          value: [
            {required: true, type: 'number', message: '请填写面额', trigger: 'blur'}
          ],
          point: [
            {required: true, type: 'number', message: '请输入兑换所需积分', trigger: 'blur'}
          ],
          money: [
            {required: true, type: 'number', message: '请输入使用需满金额', trigger: 'blur'}
          ],
          max_nums: [
            {required: true, type: 'number', message: '请输入可发放总数 0为不限', trigger: 'blur'}
          ],
          use_type: [
            {required: true, message: '请选择使用方式', trigger: 'blur'}
          ],
          start_time: [
//            {type: 'date', required: true, message: '请选择开始时间', trigger: 'blur'}
          ],
          end_time: [
//            {type: 'date', required: true, message: '请选择结束时间', trigger: 'blur'}
          ]
        }, // 验证规则
        dialogVisible_goods: false, // 选择参加活动的商品
        choice_goods_data: [], // 可选加入活动的商品列表
        choice_index: 1, // 可选商品当前页
        choice_pgCount: null, // 可选加入活动的商品列表总页数
        search_type: '', // 搜索类型
        search_str_: '', // 搜索关键词
        condition: [], // 可用代金券的商品列表
        multipleSelection_: [], // 选中参加代金券商品列表
        xian_zhi: false, // 限制分类请求
        lv1: '', // 所选一级分类
        level1: [], // 所有一级分类
        lv2: '', // 所选2级分类
        level2: [], // 所有2级分类
        lv3: '', // 所选3级分类
        level3: [], // 所有3级分类
        goods_id: '', // 已参加活动的商品id串
        dialogVisible_Q: false, // 发放优惠券弹出
        FF_type: '', // 所操作的代金券模版是什么类型
        see_vip_data: [], // 可发放优惠券会员列表 FF_type==1 时
        send_info: {}, // 可发放返回数据 FF_type!=1 时
        send_nums: '', // 发放数目 FF_type!=1 时
        multipleSelection_Q: [], // 选中发放的会员列表
        see_index: 1, // 发送代金券可选会员当前页
        see_pgCount: null, // 发送代金券可选会员总页
        search_type_s: '', // 会员类型 0=所有会员 1=店铺关注会员 会员等级标识  可以传值0或1,也可以传会员等级标识
        search_str_name: '', // 会员昵称
        search_str_s: '', // 关键词
        mobile: '', // 手机
        email: '', // 邮箱
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        vipObjs: [],
        loading: true
      }
    },
    created() {
      this.get_voucher()
    },
    methods: {
      // 获取会员列表
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
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_voucher()
      },
      // 获取代金券列表
      get_voucher() {
        window.axiox.post(this.getApi('root/auth/voucher_template_list'),
          this.dafa({
            index: this.index,
            name: this.search_str
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
      // 操作
      handle(val, id, tp) {
        this.id = id;
        this.FF_type = tp;
        switch (val) {
          case '0':
            this.dialogVisible_Q = true;
            this.send_voucher();
            break;
          case '1':
            this.edit_voucher(id);
            break;
          case '2':
            this.del_voucher(id);
            break;
        }
      },
      // 发放代金券
      send_voucher() {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/voucher_template_send_page'),
            this.dafa({
              id: this.id,
              type: this.FF_type,
              index: this.see_index,
              user_type: this.search_type_s,
              username: this.search_str_name,
              mobile: this.mobile,
              email: this.email
            })
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.see_vip_data = res.data.list;
              this.see_pgCount = res.data.fy_pgCount;
              this.send_info = res.data.info
            }
          }).catch(err => {
            reject(err);
          })
        });
      },
      // 查看会员翻页
      next_see_goods(val) {
        this.see_index = val;
        this.send_voucher()
      },
      // 获取可参与活动商品
      get_seles_goods() {
        this.dialogVisible_goods = true;
        axiox.post(this.getApi('root/auth/voucher_search_goods'),
          this.dafa({
            goods_id: this.good_id,
            index: this.choice_index,
            search_type: this.search_type,
            search_str: this.search_str_
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.choice_pgCount = res.data.fy_pgCount;
            this.choice_goods_data = res.data.list
          }
        })
      },
      // 选择商品翻页
      next_choice_goods(val) {
        this.choice_index = val;
        this.get_seles_goods()
      },
      // 编辑活动
      edit_voucher(id) {
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/voucher_template_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info) {
                this.ruleForm = res.data.info;
                if (res.data.info.use_type == 2) {
                  this.level1.push({'id': res.data.info.condition.lv1.id, 'name': res.data.info.condition.lv1.name});
                  this.lv1 = res.data.info.condition.lv1.id;
                  this.level2.push({'id': res.data.info.condition.lv2.id, 'name': res.data.info.condition.lv2.name});
                  this.lv2 = res.data.info.condition.lv2.id;
                  this.level3.push({'id': res.data.info.condition.lv3.id, 'name': res.data.info.condition.lv3.name});
                  this.lv3 = res.data.info.condition.lv3.id;
                }
              } else {
                this.ruleForm = {
                  name: '',
                  type: null,
                  value: null,
                  point: null,
                  money: null,
                  max_nums: null,
                  start_time: '',
                  end_time: '',
                  desc: '',
                  use_type: null,
                }
              }
              if (this.ruleForm.condition instanceof Array) {
                this.condition = this.ruleForm.condition;
                this.condition.forEach(item => {
                  this.goods_id += item.good_id
                })
              }
              this.$nextTick(() => {
                this.xian_zhi = true
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
      handleSelectionChange_(val) {
        this.multipleSelection_ = val
      },
      handleSelectionChange_Q(val) {
        this.multipleSelection_Q = val
      },
      // 选择团购商品
      add_seles_goods() {
        this.condition = this.multipleSelection_.concat(this.condition);
        this.dialogVisible_goods = false;
      },
      // 删除活动
      del_voucher(id) {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (id === 'all') {
            this.multipleSelection.forEach(item => {
              this.del_id.push(item.id)
            })
          } else {
            this.del_id.push(id)
          }

          this.antiShake.antiShake((resolve, reject) => {
            window.axiox.post(this.getApi('root/auth/voucher_template_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_voucher();
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
      // 删除代金券可用的商品
      del_goods_can(index, rows) {
        rows.splice(index, 1)
      },
      // 发放
      send_to() {
        let ids = [];
        if (this.FF_type == 1) {
          this.multipleSelection_Q.forEach(item => {
            ids.push(item.user_id);
          });
          this.send_to_ajax(ids)
        } else {
          if (!this.send_nums) {
            this.$message('请输入发放数量')
          } else {
            this.send_to_ajax()
          }
        }
      },
      // 获取分类
      getLv1(val) {
        if (val) {
          axiox.post(this.getApi('root/auth/get_cate')
          ).then(res => {
            if (res.data.code == 0) {
              this.level1 = res.data.list
            } else {
              this.$message(res.data.msg)
            }
          }).catch(err => {
            this.$message('对不起！请稍后再试')
          })
        }
      },
      getLv2(val) {
        if (this.xian_zhi) {
          axiox.post(this.getApi('root/auth/get_cate'),
            `id=${val}`
          ).then(res => {
            if (res.data.code == 0) {
              this.level2 = res.data.list;
              this.lv2 = '';
              this.lv3 = '';
            }
          })
        }
      },
      getLv3(val) {
        if (this.xian_zhi) {
          axiox.post(this.getApi('root/auth/get_cate'),
            `id=${val}`
          ).then(res => {
            if (res.data.code == 0) {
              this.level3 = res.data.list;
              this.lv3 = '';
            }
          })
        }
      },
      // 发放
      send_to_ajax(ids = '') {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/voucher_template_send'),
            this.dafa({
              id: this.id,
              type: this.FF_type,
              users_id: ids,
              send_nums: this.send_nums
            })
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.dialogVisible_Q = false;
              this.get_voucher()
            }
          }).catch(err => {
            reject(err);
          })
        })
      },
      // 提交保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let TIAO_JIAN = '';
            if (this.ruleForm.use_type == 1) {
              this.condition.forEach(item => {
                TIAO_JIAN += item.good_id + ',';
              })
            } else if (this.ruleForm.use_type == 2) {
              TIAO_JIAN = this.lv3 ? this.lv3 : this.lv2 ? this.lv2 : this.lv1
            } else {
              TIAO_JIAN = ''
            }

            this.antiShake.antiShake((resolve, reject) => {
              axiox.post(this.getApi('root/auth/voucher_template_save'),
                this.dafa({
                  id: this.id,
                  name: this.ruleForm.name,
                  value: this.ruleForm.value,
                  type: this.ruleForm.type,
                  point: this.ruleForm.point,
                  money: this.ruleForm.money,
                  max_nums: this.ruleForm.max_nums,
                  start_time: this.ruleForm.start_time,
                  end_time: this.ruleForm.end_time,
                  desc: this.ruleForm.desc,
                  use_type: this.ruleForm.use_type,
                  condition: TIAO_JIAN,
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_voucher()
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
      },
      // 时间格式
      STIME(val) {
        this.ruleForm.start_time = val;
      },
      ETIME(val) {
        this.ruleForm.end_time = val;
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
  .see-goods-fy {
    overflow: hidden;
    margin-top: 10px;
  }

  .el-pagination {
    float: right;
  }

  .del-sele-good {
    width: 60px;
    margin: 0;
  }

  .submit-box {
    margin: 20px 0 40px;
    padding-left: 240px;
  }

  .u-right {
    margin-bottom: 15px;
  }

  .u-right .el-input {
    width: 290px;
  }

  .prop .el-table .el-button {
    width: 60px;
    margin: 0;
  }

  .small-ipt .el-input {
    width: 180px;
  }

  .send-sum ul {
    border-left: 1px solid #dfe6ec;
    border-top: 1px solid #dfe6ec;
    overflow: hidden;
  }

  .send-sum li {
    height: 40px;
    line-height: 38px;
    float: left;
    width: 50%;
    border-right: 1px solid #dfe6ec;
    border-bottom: 1px solid #dfe6ec;
    box-sizing: border-box;
  }

  .send-sum li label {
    display: inline-block;
    width: 140px;
    text-align: right;
    margin-right: 10px;
    padding-right: 5px;
    background-color: #FAFAFA;
  }

  .send-sum .el-input {
    width: 240px;
  }
</style>
