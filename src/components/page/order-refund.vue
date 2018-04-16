<template>
  <div class="order-receipt-list prop-box">
    <!--退款单列表-->
    <div class="m-order-receipt-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2 class="large-search">
        退款单列表
        <div class="u-right">
          <el-select class="sele-s" v-model="refund_type" placeholder="退款方式" :clearable="true">
            <el-option label="账户余额" value="0"></el-option>
            <el-option label="支付宝" value="1"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="pay_status" placeholder="退款状态" :clearable="true">
            <el-option label="申请退款" value="0"></el-option>
            <el-option label="不予退款" value="1"></el-option>
            <el-option label="退款成功" value="2"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
            <el-option label="订单编号" value="0"></el-option>
            <el-option label="申请人" value="1"></el-option>
          </el-select>
          <el-input placeholder="搜索关键词" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_order_refund"></el-button>
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
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.pay_status==0" type="danger" size="small" icon="el-icon-search"
                       @click="see_order(scope.row.id,scope.row.pay_status)">处理
            </el-button>
            <el-button v-else type="danger" size="small" icon="el-icon-search"
                       @click="see_order(scope.row.id,scope.row.pay_status)">查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="no"
          label="退款单号"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="order_no"
          label="订单编号"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="type"
          label="订单类型"
          min-width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1 ">团购订单</span>
            <span v-else-if="scope.row.type == 2 ">限时抢购</span>
            <span v-else-if="scope.row.type == 3 ">捆绑促销</span>
            <span v-else>普通订单</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="申请人"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="refund_type"
          label="退款方式"
          min-width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.refund_type == 1 ">支付宝</span>
            <span v-else>账户余额</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="退款状态"
          min-width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_status == 1 ">不予退款</span>
            <span v-else-if="scope.row.pay_status == 2 ">退款成功</span>
            <span class="c-danger" v-else>申请退款</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="申请日期"
          min-width="180">
        </el-table-column>
        <!--打印暂时搁置-->
        <!--   <el-table-column
             label="打印"
             min-width="100">
             <template slot-scope="scope">
               &lt;!&ndash;<el-button type="danger" size="small" icon="delete" @click="del_spec(scope.$index, tableData)">删除&ndash;&gt;
               &lt;!&ndash;</el-button>&ndash;&gt;
               <el-dropdown>
                 <el-button type="primary" size="small">
                   打印<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>
                 </el-button>
                 <el-dropdown-menu slot="dropdown">
                   <el-dropdown-item>订单</el-dropdown-item>
                   <el-dropdown-item>购物单</el-dropdown-item>
                   <el-dropdown-item>配送单</el-dropdown-item>
                   <el-dropdown-item>快递单</el-dropdown-item>
                 </el-dropdown-menu>
               </el-dropdown>
             </template>
           </el-table-column>-->
      </el-table>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--操作-->
    <el-dialog
      title="处理退款单"
      :visible.sync="dialogVisible"
      width="80%">
      <div class="see">
        <h3>商品信息：</h3>
        <h4>店铺名称：{{order_goods.shop_name}}</h4>
        <el-table
          :data="order_goods.goods"
          stripe
          style="width: 100%">
          <el-table-column
            prop="img"
            label="商品"
            min-width="100">
            <template slot-scope="scope">
              <img :src="order_goods.goods[scope.$index].img" alt="商品图">
            </template>
          </el-table-column>
          <el-table-column
            prop="no"
            label="货号"
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            min-width="160">
          </el-table-column>
          <el-table-column
            prop="spec"
            label="规格"
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="售价"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="goods_nums"
            label="数量"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="real_price"
            label="促销价"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="total_money"
            label="小计"
            min-width="100">
          </el-table-column>
        </el-table>
        <h3>退款单详情：</h3>
        <ul class="order-info order-info-ul">
          <li><span>订单类型：</span><em v-if="order_info.type==3">捆绑促销</em><em v-else-if="order_info.type==1">团购订单</em><em
            v-else-if="order_info.type==2">限时抢购</em><em v-else>普通订单</em></li>
          <li><span>订单编号：</span>{{order_info.order_no}}</li>
          <li><span>下单时间：</span>{{order_info.create_time}}</li>
          <li><span>支付方式：</span>{{order_info.payname}}</li>
          <li><span>支付手续费：</span>{{order_info.handling_fee}}</li>
          <li><span>配送方式：</span>{{order_info.exname}}</li>
          <li><span>配送费用：</span>{{order_info.payable_freight}}</li>
          <li><span>实际配送费用：</span>{{order_info.real_freight}}</li>
          <li><span>代金券：</span>{{order_info.voucher}}</li>
          <li><span>应付商品总金额：</span>{{order_info.payable_amount}}</li>
          <li><span>实付商品总金额：</span>{{order_info.real_amount}}</li>
          <li><span>发票类型：</span><em v-if="order_info.invoice_type==1">单位</em><em v-else>个人</em></li>
          <li><span>发票抬头：</span>{{order_info.invoice_title}}</li>
          <li><span>发票税金：</span>{{order_info.taxes}}</li>
          <li><span>活动优惠金额：</span>{{order_info.discount_amount}}</li>
          <li><span>订单原价总金额：</span>{{order_info.original_amount}}</li>
          <li class="el-ipt-m"><span>订单折扣或涨价金额：</span>{{order_info.adjust_amount}}
            <!-- <el-tooltip class="item" effect="dark" content="例：想给顾客降价10元，就输入-10；想涨价10元，就输入10" placement="top-start">
               <el-input
                 v-model="order_info.adjust_amount" @blur="change_price(order_info.adjust_amount)"
                 placeholder="0.00"></el-input>
             </el-tooltip>-->
          </li>
          <li><span>调整后订单总金额：</span>{{order_info.order_amount}}</li>
          <li class="textarea-box"><span>调价原因：</span>{{order_info.adjust_note}}</li>
          <li><span>用户备注：</span>{{order_info.user_remark}}</li>
          <li><span>管理人员备注：</span>{{order_info.admin_remark}}</li>
        </ul>
        <h3>退款单处理：</h3>
        <ul class="order-info order-info-ul">
          <li><span>订单类型：</span><em v-if="refund_info.type==3">捆绑促销</em><em v-else-if="refund_info.type==1">团购订单</em><em
            v-else-if="refund_info.type==2">限时抢购</em><em v-else>普通订单</em></li>
          <li><span>订单编号：</span>{{refund_info.order_no}}</li>
          <li><span>申请人：</span>{{refund_info.username}}</li>
          <li><span>退款方式：</span><em v-if="refund_info.refund_type==1">支付宝</em><em v-else>账户余额</em></li>
          <li class="ali_info"><span>支付宝账户：</span>{{refund_info.payee_account}}</li>
          <li class="ali_info"><span>支付宝真实姓名：</span>{{refund_info.payee_real_name}}</li>
          <li><span>退款状态：</span><em v-if="refund_info.pay_status==1">不予退款</em><em v-else-if="refund_info.pay_status==2">退款成功</em><em
            v-else>申请退款</em></li>
          <li><span>管理员：</span>{{refund_info.admin_name}}</li>
          <li><span>处理时间：</span>{{refund_info.handling_time}}</li>
          <li><span>申请原因：</span>{{refund_info.content}}</li>
          <li class="textarea-box"><span>处理意见：</span>
            <el-input class="adjust_note" type="textarea"
                      :rows="2" v-model="refund_info.adjust_note" placeholder="请输入内容"></el-input>
          </li>
        </ul>
        <!--   <ul class="get-user order-info-ul el-ipt-m">
             <li><span>收货人姓名：</span>
               <el-input
                 v-model="accept_info.accept_name"></el-input>
               <em v-if="!accept_info.accept_name">请输入正确信息</em>
             </li>
             <li><span>收货人手机：</span>
               <el-input
                 v-model="accept_info.mobile"></el-input>
               <em v-if="!accept_info.mobile">请输入正确信息</em>
             </li>
             <li><span>收货人电话：</span>
               <el-input
                 v-model="accept_info.phone"></el-input>
             </li>
             <li><span>邮编：</span>
               <el-input
                 v-model="accept_info.zip"></el-input>
             </li>
             <li class="sele-box large-li">
               <span>收货地址：</span>
               <el-select v-model="province_id" filterable placeholder="选择省份" @visible-change="get_province"
                          @change="get_city">
                 <el-option
                   v-for="item in province"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
                 </el-option>
               </el-select>
               <el-select v-model="city_id" filterable placeholder="选择城市" @change="get_county">
                 <el-option
                   v-for="item in city"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
                 </el-option>
               </el-select>
               <el-select v-model="county_id" filterable placeholder="选择区县">
                 <el-option
                   v-for="item in county"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
                 </el-option>
               </el-select>
               <em v-if="!province_id || !city_id || !county_id">请选择完整地区信息</em>
             </li>
             <li class="large-li"><span>详细街道地址：</span>
               <el-input
                 v-model="accept_info.addr"></el-input>
               <em v-if="!accept_info.addr">请填写详细地址</em>
             </li>
           </ul>-->
      </div>
      <span slot="footer" class="dialog-footer" v-if="!see">
        <el-button type="danger" @click="handle_refund(1)">拒 绝</el-button>
        <el-button type="primary" @click="handle_refund(2)">同 意</el-button>
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
          content: `点击查看订单将显示订单（包括订单物品）的详细信息。`
        }, // 提示模块参数
        totalPage: 1, // 总页
        tableData: [], // 表格数据
        refund_type: '', //退款方式  0=账户余额 1=按支付方式原路返还
        pay_status: '',  //退款状态  0=申请退款 1=不予退款 2=退款成功
        search_type: '', // 搜索类型   0=订单编号 1=申请人
        search_str: '', // 搜索关键字
        dialogVisible: false, // 弹出组件
        order_goods: {}, // 商品信息
        order_info: {}, // 订单信息
        refund_info: {}, // 退款信息
        see: true, // 查看或处理
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_order_refund()
    },
    methods: {
      // 监听子分页组件 翻页
      to_page() {
        this.get_order_refund()
      },
      // 获取退款单列表
      get_order_refund() {
        window.axiox.post(this.getApi('root/auth/refund_list'),
          this.dafa({
            index: this.index,
            refund_type: this.refund_type,
            pay_status: this.pay_status,
            search_type: this.search_type,
            search_str: this.search_str
          })
        ).then(res => {
          this.loading = false
          if (res.data.code === 0) {
            this.tableData = res.data.list
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message('对不起！请稍后再试')
        })
      },
      // 订单操作
      see_order(id, pay_status) {
        this.dialogVisible = true;
        this.id = id;
        pay_status == 0 ? this.see = false : this.see = true;
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/refund_view'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.refund_info = res.data.refund_info;
              this.order_info = res.data.order_info;
              this.order_goods = res.data.refund_goods;
            }
          }).catch(err => {
            reject(err);
          })
        })
      },
      // 操作
      handle_refund(val) {
        if (this.refund_info.adjust_note) {
          this.antiShake.antiShake((resolve, reject) => {
            axiox.post(this.getApi('root/auth/refund_act'),
              this.dafa({
                id: this.id,
                status: val,
                order_amount: this.order_info.order_amount,
                handling_idea: this.refund_info.adjust_note
              })
            ).then(res => {
              resolve(res);
              if (res.data.code === 0) {
                this.dialogVisible = false;
                this.get_order_refund();
              }
            }).catch(err => {
              reject(err);
            })
          })
        } else {
          this.$message('请输入处理意见')
        }
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
  i {
    color: #FF4949;
    vertical-align: inherit;
  }

  .el-dialog h3 {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-bottom: 1px dashed #eee;
    color: #333;
    background-color: #f0f0f0;
    padding-left: 15px;
    margin: 20px 0 10px;
  }

  .el-dialog h4 {
    line-height: 40px;
    color: #ff4d51;
    padding-left: 20px;
  }

  .order-info-ul {
    overflow: hidden;
    border-top: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
  }

  .order-info-ul li {
    float: left;
    width: 50%;
    line-height: 38px;
    border-bottom: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
    box-sizing: border-box;
  }

  .order-info-ul .large-li {
    width: 100%
  }

  .order-info-ul li span {
    display: inline-block;
    width: 140px;
    color: #333;
    background-color: #f1f2f3;
    margin-right: 10px;
    padding-left: 20px;
  }

  .order-info-ul em {
    margin-left: 10px;
    color: #ff4d51;
  }

  .order-info-ul .textarea-box {
    width: 100%;
  }

  .el-table img {
    width: 62px;
    height: 35px;
  }

  .dialog-footer .el-button {
    width: 140px;
  }

  /*
     .el-ipt-m .el-input {
       width: 240px;
     }

     .large-li .el-input {
       width: 430px;
     }

     .sele-box .el-select {
       width: 140px;
     }



     .el-form {
       overflow: hidden;
       border-top: 1px solid #dfe6ec;
       border-left: 1px solid #dfe6ec;
     }

     .el-form > div {
       padding: 0;
     }

     .el-form-item__label {
       color: #333;
       background-color: #f1f2f3;
       margin-right: 10px;
       padding-left: 20px;
     }

     .el-form .el-form-item {
       padding-top: 2px;
       width: 50%;
       height: 42px;
       float: left;
       border-bottom: 1px solid #dfe6ec;
       border-right: 1px solid #dfe6ec;
       box-sizing: border-box;
       margin: 0;
     }

     .m-see .el-form .el-input {
       width: 240px;
       margin-left: 17px;
     }

     .el-col .el-form-item {
       width: 100%;
       border: none;
     }

     .lian-jie {
       text-align: center;
     }

     .fa-huo .el-input {
       width: 90%;
     }
   */
</style>
