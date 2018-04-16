<template>
  <div class="order-receipt-list prop-box">
    <!--退换货维修单列表-->
    <div class="m-order-receipt-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2 class="large-search">
        退换货维修单列表
        <div class="u-right">
          <el-date-picker
            v-model="date_time"
            type="datetimerange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择时间范围"
            @change="choice_time"
            align="right">
          </el-date-picker>
          <el-select class="sele-s" v-model="after_type" placeholder="售后类型" :clearable="true">
            <el-option label="退货退款" value="0"></el-option>
            <el-option label="换货" value="1"></el-option>
            <el-option label="维修" value="2"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="status" placeholder="售后状态" :clearable="true">
            <el-option label="待审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核失败" value="2"></el-option>
            <el-option label="已发货" value="3"></el-option>
            <el-option label="已完成" value="4"></el-option>
            <el-option label="已取消" value="5"></el-option>
            <el-option label="已收货" value="6"></el-option>
            <el-option label="已拒签" value="7"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
            <el-option label="订单编号" value="0"></el-option>
            <el-option label="商品名称" value="1"></el-option>
            <el-option label="会员名称" value="2"></el-option>
            <el-option label="店铺名称" value="3"></el-option>
            <el-option label="物流单号" value="4"></el-option>
          </el-select>
          <el-input placeholder="搜索关键词" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_order_return"></el-button>
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
            <el-dropdown
              @command="handle($event,scope.row.return_id,scope.row.after_type)">
              <el-button type="primary" icon="setting" size="small">处理</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0"><i class="iconfont icon-chakan-copy"></i>&nbsp;查看</el-dropdown-item>
                <el-dropdown-item command="1" v-if="scope.row.status == 0">
                  <i class="iconfont icon-wancheng1"></i>审核
                </el-dropdown-item>
                <el-dropdown-item command="2" v-if="scope.row.status == 3">
                  <i class="iconfont icon-yifahuo"></i>&nbsp;收货
                </el-dropdown-item>
                <el-dropdown-item command="3" v-if="scope.row.status == 3">
                  <i class="iconfont icon-jinzhi"></i>&nbsp;拒签
                </el-dropdown-item>
                <el-dropdown-item command="4"
                                  v-if="scope.row.status == 1 && scope.row.after_type != 0">
                  <i class="iconfont icon-fahuo"></i>&nbsp;发货
                </el-dropdown-item>
                <el-dropdown-item command="5" v-if="scope.row.status == 6"><i
                  class="iconfont icon-wancheng"></i>&nbsp;完成
                </el-dropdown-item>
                <el-dropdown-item command="6"><i class="iconfont icon-wancheng"></i>售后记录</el-dropdown-item>
                <el-dropdown-item command="7"><i class="iconfont icon-wancheng"></i>物流信息</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="return_no"
          label="服务单编号"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="order_no"
          label="订单编号"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="good_img"
          label="商品图片"
          min-width="100">
          <template slot-scope="scope">
            <img class="good_img" :src="scope.row.good_img" alt="logo" width="45" height="35">
          </template>
        </el-table-column>
        <el-table-column
          prop="good_name"
          label="商品名称"
          min-width="300">
        </el-table-column>
        <el-table-column
          prop="apply_num"
          label="申请数量"
          min-width="90">
        </el-table-column>
        <el-table-column
          prop="apply_time"
          label="服务单申请时间"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="服务单状态"
          min-width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0 ">待审核</span>
            <span v-else-if="scope.row.status == 1 ">审核通过</span>
            <span v-else-if="scope.row.status == 2 ">审核失败</span>
            <span v-else-if="scope.row.status == 3 ">已发货</span>
            <span v-else-if="scope.row.status == 4 ">已完成</span>
            <span v-else-if="scope.row.status == 5 ">已取消</span>
            <span v-else-if="scope.row.status == 6 ">已收货</span>
            <span v-else>已拒签</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="after_type"
          label="售后类型"
          min-width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.after_type == 0 ">退货退款</span>
            <span v-else-if="scope.row.after_type == 1 ">换货</span>
            <span v-else-if="scope.row.after_type == 2 ">维修</span>
          </template>
        </el-table-column>
      </el-table>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!-- 重新生成订单界面
     <el-dialog title="换货维修单" :visible.sync="reOrderVue" size="large">
       <div class="see">
         <h3>订单信息</h3>
         <ul class="get-user order-info-ul el-ipt-m">
           <li><span>收货人姓名：</span>
             <el-input v-model="re_info.accept_name"></el-input>
             <em v-if="!re_info.accept_name">请输入正确信息</em>
           </li>
           <li><span>收货人手机：</span>
             <el-input
               v-model="re_info.mobile"></el-input>
             <em v-if="!re_info.mobile">请输入正确信息</em>
           </li>
           <li><span>收货人固话：</span>
             <el-input
               v-model="re_info.phone"></el-input>
             <em v-if="!re_info.phone">请输入正确信息</em>
           </li>
           <li><span>邮编：</span>
             <el-input
               v-model="re_info.zip"></el-input>
             <em v-if="!re_info.zip">请输入正确信息</em>
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
               v-model="re_info.addr"></el-input>
             <em v-if="!re_info.addr">请填写详细地址</em>
           </li>
         </ul>
         <h3>物流信息</h3>
         <ul class="get-user order-info-ul el-ipt-m">
           <li><span>物流公司：</span>
             <el-select v-model="re_express_company_id" filterable placeholder="选择物流公司"
                        @visible-change="get_express_company">
               <el-option
                 v-for="item in re_express_company"
                 :key="item.id"
                 :label="item.name"
                 :value="item.id">
               </el-option>
             </el-select>
             <em v-if="!re_express_company_id">请填写信息</em>
           </li>
           <li><span>物流单号：</span>
             <el-input
               v-model="re_express_no"></el-input>
             <em v-if="!re_express_no">请填写信息</em>
           </li>
           <li class="large-li"><span>处理意见：</span>
             <el-input
               v-model="re_handling_idea"></el-input>
             <em v-if="!re_handling_idea">请填写信息</em>
           </li>
         </ul>
       </div>

       <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="return_send_act">发 货</el-button>
        </span>
     </el-dialog>-->

    <!--售后记录-->
    <el-dialog title="售后记录" :visible.sync="postSaleRecord" width="60%">
      <div class="see">
        <h3>售后记录</h3>
        <el-table
          :data="after_process"
          stripe
          style="width: 100%">
          <el-table-column
            prop="time"
            label="操作时间"
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="act_intro"
            label="操作描述"
            min-width="160">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="操作备注"
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="act_user"
            label="操作人名称"
            min-width="100">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!--物流信息-->
    <el-dialog title="物流信息" :visible.sync="LogisInformation" width="60%">
      <div class="see">
        <h3>物流信息</h3>
        <ul class="order-info order-info-ul">
          <li>
            <span>运单号：</span>
            {{express_info.nu}}
          </li>
          <li>
            <span>物流公司名称：</span>
            {{express_info.com}}
          </li>
        </ul>
        <el-table
          :data="express_info.data"
          stripe
          style="width: 100%">
          <el-table-column
            prop="time"
            label="时间"
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="context"
            label="跟踪进度"
            min-width="160">
          </el-table-column>
          <el-table-column
            prop="location"
            label="地点"
            min-width="140">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!--操作-->
    <el-dialog
      title="退换货维修单"
      :visible.sync="dialogVisible"
      width="80%">
      <div class="see" v-if="val == 0 || val == 1">
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
        <h3>退换货维修单详情：</h3>
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
        <h3>退换货维修信息：</h3>
        <ul class="order-info order-info-ul">
          <!--<li><span>售后类型：</span><em v-if="after_info.type==1">换货维修</em><em v-else>退货</em></li>-->
          <!--<li><span>订单类型：</span><em v-if="after_info.type==3">捆绑促销</em><em v-else-if="after_info.type==1">团购订单</em><em-->
          <!--v-else-if="after_info.type==2">限时抢购</em><em v-else>普通订单</em></li>-->
          <li><span>服务单编号：</span>{{after_info.return_no}}</li>
          <li><span>订单编号：</span>{{after_info.order_no}}</li>
          <li><span>商品名称：</span>{{after_info.good_name}}</li>
          <li><span>商品图片：</span>
            <!--<img v-for="item in after_info.imgs" :src="item" @click="see_big_img(item)" alt="">&nbsp;点击查看大图-->
            <a :href="after_info.good_img" target="_blank"><img :src="after_info.good_img" alt="">&nbsp;&nbsp;&nbsp;点击查看大图</a>
          </li>
          <li><span>售后数量：</span>{{after_info.apply_num}}</li>
          <li><span>服务单申请时间：</span>{{after_info.apply_time}}</li>
          <li>
            <span>售后类型：</span>
            <em v-if="after_info.after_type==0">退货退款</em>
            <em v-else-if="after_info.after_type==1">换货</em>
            <em v-else-if="after_info.after_type==2">维修</em>
          </li>
          <span v-if="after_info.after_type==0">
            <li>
              <span>退款方式：</span>
              <em v-if="after_info.refund_type==0">退款到账户余额</em>
              <em v-else-if="after_info.refund_type==1">退款到支付宝</em>
              <em v-else-if="after_info.refund_type==''">其他方式无退款</em>
            </li>
            <li class="ali_info"><span>支付宝账户：</span>{{after_info.payee_account}}</li>
            <li class="ali_info"><span>支付宝真实姓名：</span>{{after_info.payee_real_name}}</li>
          </span>

          <!--<li><span>退款方式：</span><em v-if="after_info.refund_type==1">原路返还</em><em v-else>账户余额</em></li>-->
          <li><span>服务单状态：</span>
            <em v-if="after_info.status==0">待审核</em>
            <em v-if="after_info.status==1">审核通过</em>
            <em v-else-if="after_info.pay_status==2">审核失败</em>
            <em v-else-if="after_info.pay_status==3">买家发货</em>
            <em v-else-if="after_info.pay_status==4">已完成</em>
            <em v-else-if="after_info.pay_status==5">已取消</em>
            <em v-else-if="after_info.pay_status==6">已收货</em>
            <em v-else-if="after_info.pay_status==7">已拒签</em>
          </li>
          <li>
            <span>申请凭据：</span>
            <em v-if="after_info.invoice==0">有发票</em>
            <em v-else-if="after_info.invoice==1">无发票</em>
          </li>
          <li>
            <span>是否已收到货：</span>
            <em v-if="after_info.is_take==0">已收到货</em>
            <em v-else-if="after_info.is_take==1">未收到货</em>
          </li>
          <li><span>问题描述：</span>{{after_info.description}}</li>
          <li>
            <span>申请配图：</span>
            <!--<img v-for="item in after_info.imgs" :src="item" alt="">-->
            <a v-for="item in after_info.imgs" :href="item" target="_blank"><img :src="item"
                                                                                 alt="">&nbsp;&nbsp;&nbsp;</a>
          </li>
          <li>
            <span>顾客姓名：</span>
            {{after_info.accept_name}}
          </li>
          <li>
            <span>手机号码：</span>
            {{after_info.mobile}}
          </li>
          <li>
            <span>固话：</span>
            {{after_info.phone}}
          </li>
        </ul>

        <h3>卖家信息：</h3>
        <ul class="get-user order-info-ul el-ipt-m">
          <li><span>卖家姓名：</span>
            <el-input :disabled="LookOrCheck" v-model="seller_info.seller_name"></el-input>
            <em v-if="!seller_info.seller_name">请输入正确信息</em>
          </li>
          <li><span>卖家手机：</span>
            <el-input
              :disabled="LookOrCheck" v-model="seller_info.seller_mobile"></el-input>
            <em v-if="!seller_info.seller_mobile">请输入正确信息</em>
          </li>
          <li><span>卖家固话：</span>
            <el-input
              :disabled="LookOrCheck" v-model="seller_info.seller_phone"></el-input>
            <em v-if="!seller_info.seller_phone">请输入正确信息</em>
          </li>
          <li><span>卖家邮编：</span>
            <el-input
              :disabled="LookOrCheck" v-model="seller_info.seller_zip"></el-input>
            <em v-if="!seller_info.seller_zip">请输入正确信息</em>
          </li>
          <li v-if="LookOrCheck==false" class="sele-box large-li">
            <span>卖家收货地址：</span>
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
          <li v-if="LookOrCheck==false" class="large-li"><span>卖家详细街道地址：</span>
            <el-input
              :disabled="LookOrCheck" v-model="addr"></el-input>
            <em v-if="!addr">请填写详细地址</em>
          </li>
          <li v-else="LookOrCheck==true" class="large-li">
            <span>卖家收货地址：</span>
            {{seller_info.location}}
          </li>
          <li v-if="LookOrCheck==false" class="large-li">
            <span>卖家处理意见：</span>
            <el-input class="adjust_note" :disabled="LookOrCheck" v-model="adjust_note"
                      placeholder="请输入内容"></el-input>
            <em v-if="!adjust_note">请输入正确信息</em>
          </li>
        </ul>

      </div>

      <div v-else-if="val == 2 || val == 3">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入操作备注"
          v-model="handling_idea">
        </el-input>
      </div>
      <div v-else-if="val == 4">
        <!--<h3>收货人信息：</h3>
        <ul class="order-info order-info-ul">
          <li><span>收货人姓名：</span>{{accept_info.accept_name}}</li>
          <li><span>收货人联系手机：</span>
            <el-input v-model="accept_info.mobile"></el-input>
          </li>
          <li><span>收货人联系电话：</span>{{accept_info.phone}}</li>
          <li><span>邮编：</span>{{accept_info.zip}}</li>
          <li><span>省级名称：</span>{{accept_info.province_name}}</li>
          <li><span>市级名称：</span>{{accept_info.city_name}}</li>
          <li><span>县级名称：</span>{{accept_info.county_name}}</li>
          <li><span>详细街道地址：</span>
            <el-input v-model="accept_info.addr"></el-input>
          </li>
          <li><span>物流公司：</span>
            <el-select v-model="express_company_id" placeholder="请选择">
              <el-option
                v-for="item in express_company"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </li>
          <li><span>物流单号：</span>
            <el-input v-model="accept_info.express_no"></el-input>
          </li>
        </ul>-->
        <h3>订单信息</h3>
        <ul class="get-user order-info-ul el-ipt-m">
          <li><span>收货人姓名：</span>
            <el-input v-model="re_info.accept_name"></el-input>
            <em v-if="!re_info.accept_name">请输入正确信息</em>
          </li>
          <li><span>收货人手机：</span>
            <el-input
              v-model="re_info.mobile"></el-input>
            <em v-if="!re_info.mobile">请输入正确信息</em>
          </li>
          <li><span>收货人固话：</span>
            <el-input
              v-model="re_info.phone"></el-input>
          </li>
          <li><span>邮编：</span>
            <el-input
              v-model="re_info.zip"></el-input>
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
              v-model="re_info.addr"></el-input>
            <em v-if="!re_info.addr">请填写详细地址</em>
          </li>
        </ul>
        <h3>物流信息</h3>
        <ul class="get-user order-info-ul el-ipt-m">
          <li><span>物流公司：</span>
            <el-select v-model="re_express_company_id" filterable placeholder="选择物流公司"
                       @visible-change="get_express_company">
              <el-option
                v-for="item in re_express_company"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <em v-if="!re_express_company_id">请填写信息</em>
          </li>
          <li><span>物流单号：</span>
            <el-input
              v-model="re_express_no"></el-input>
            <em v-if="!re_express_no">请填写信息</em>
          </li>
          <li class="large-li"><span>处理意见：</span>
            <el-input
              v-model="re_handling_idea"></el-input>
            <em v-if="!re_handling_idea">请填写信息</em>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer" v-if="val==1">
         <el-button type="danger" @click="handle_refund(2)">拒 绝</el-button>
         <el-button type="primary" @click="handle_refund(1)">同 意</el-button>
       </span>
      <span slot="footer" class="dialog-footer" v-else-if="val == 2 || val == 3">
         <el-button type="danger" @click="handle_2_3">确 认</el-button>
       </span>
      <span slot="footer" class="dialog-footer" v-else-if="val == 4">
         <el-button type="danger" @click="to_return_good">发 货</el-button>
       </span>
    </el-dialog>
    <div v-if="see_img" class="cee-big-img">
      <img :src="img_big" alt="" width="400px">
      <el-button type="info" @click="see_img = false">关 闭</el-button>
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
          content: `点击查看订单将显示订单（包括订单物品）的详细信息。`
        }, // 提示模块参数
        totalPage: 1, // 总页
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
        after_type: '', // 售后类型  0=退货退款 1=换货 2=维修
        status: '', // 售后状态  0=待审核 1=审核通过 2=审核未通过 3=买家发货 4=已完成 5=已取消
        search_type: '', // 搜索类型  0=订单编号 1=商品名称 2=会员名称 3=店铺名称 4=物流单号
        search_str: '', // 搜索关键字
        dialogVisible: false, // 弹出组件
        next: false, // 修复地址请求
        province_id: '', // 省份id
        province: [], // 省份列表
        city_id: '', // 城市id
        city: [], // 城市列表
        county_id: '', // 区县id
        county: [], // 区县列表
        order_goods: {}, // 商品信息
        order_info: {}, // 订单信息
        after_info: {}, // 退换货维修信息
        accept_info: {}, // 收货人信息
        see_img: false, // 查看大图
        img_big: '', // 大图链接
        handling_idea: '', // 收货|拒签 操作备注
        express_company_id: '', // 物流公司ID
        express_company: [], // 物流公司
        express_no: '', // 物流单号
        val: '', // 操作指令 0 查看 1 审核 2收货 3拒签 4发货 5完成 6售后记录 7物流记录
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        seller_info: {
          seller_name: '',
          location: '',
          seller_zip: '',
          seller_mobile: '',
          seller_phone: '',
        }, // 卖家信息
        LookOrCheck: true, // true 查看 false 编辑
        adjust_note: '', // 卖家处理意见
        addr: '',
        reOrderVue: false, // 弹出生成订单对话框
        re_info: {
          accept_name: '',
          mobile: '',
          phone: '',
          zip: '',
          province_id: '',
          province_name: '',
          city_id: '',
          city_name: '',
          county_id: '',
          county_name: '',
          addr: '',
        },
        re_express_company_id: '', // 再次生成订单物流信息
        re_express_company: '',
        re_express_no: '',
        re_handling_idea: '',
        postSaleRecord: false, // 售后弹出层
        after_process: [],
        LogisInformation: false, // 物流信息
        express_info: {
          nu: '',
          com: '',
          data: [],
        },
        loading: true,
        cityChange: false
      }
    },
    created() {
      this.get_order_return()
    },
    methods: {
      // 获取物流信息
      get_express_company() {
        axiox.post(this.getApi('root/auth/express_company_list')
        ).then(res => {
          if (res.data.code === 0) {
            this.re_express_company = res.data.list;
          } else {
            this.$message(res.data.msg);
          }
        }).catch(err => {
          this.$message('对不起，请稍后再试');
        })
      },
      // 获取省份
      get_province(val) {
        if (val) {
          axiox.post(this.getApi('coms/get_area'),
            `id=0`
          ).then(res => {
            if (res.data.code === 0) {
              this.province = res.data.list;
              this.next = true
            } else {
              this.$message(res.data.msg);
              this.next = false
            }
          }).catch(err => {
//            console.log(err);
            this.$message('对不起！请稍后再试')
          })
        }
      },
      // 获取城市
      get_city(val) {
        if (this.next) {
          this.city_id = null;
          this.county_id = null;
          axiox.post(this.getApi('coms/get_area'),
            `id=${val}`
          ).then(res => {
            if (res.data.code === 0) {
              this.city = res.data.list;
              this.cityChange = true;
            } else {
              this.$message(res.data.msg);
              this.next = false
            }
          }).catch(err => {
            this.$message('对不起！请稍后再试')
          })
        }
      },
      // 获取区县
      get_county(val) {
        if (this.cityChange) {
          axiox.post(this.getApi('coms/get_area'),
            `id=${val}`
          ).then(res => {
            if (res.data.code === 0) {
              this.county = res.data.list;
              this.county_id = null;
              this.cityChange = false;
              // this.ruleForm.county = null
            } else {
              this.$message(res.data.msg);
              this.cityChange = false;
            }
          }).catch(err => {
            // console.log(err);
            this.$message('对不起！请稍后再试')
          })
        }
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_order_return()
      },
      // 获取退换货维修单列表
      get_order_return() {
        window.axiox.post(this.getApi('root/auth/return_list'),
          this.dafa({
            index: this.index,
            start_time: this.start_time,
            end_time: this.end_time,
            after_type: this.after_type,
            status: this.status,
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
      // 处理
      handle(val, id, after_type) {
        this.id = id;
        this.val = val;
        switch (val) {
          case '0':
            this.see_order();
            this.dialogVisible = true;
            this.LookOrCheck = true;
            break;
          case '1':
            this.see_order();
            this.dialogVisible = true;
            this.LookOrCheck = false;
            break;
          case '2':
          case '3':
            this.handle_2_3();
            this.dialogVisible = true;
            break;
          case '4':
            this.return_good();
            this.get_WL();
            this.dialogVisible = true;
            break;
          case '5':
            this.ret_ok();
            break;
          case '6':
            this.post_sale();
            this.postSaleRecord = true;
            break;
          case '7':
            this.logis_infor();
            this.LogisInformation = true;
            break;
        }
      },
      // 售后记录
      post_sale() {
        axiox.post(this.getApi('root/auth/after_process'),
          `id=${this.id}`,
        ).then(res => {
          if (res.data.code === 0) {
            this.after_process = res.data.after_process;
          } else {
            this.$message(res.data.code);
          }
        }).catch(err => {
          this.$message('对不起，请稍后重试');
        })
      },
      // 物流信息
      logis_infor() {
        axiox.post(this.getApi('root/auth/express_info'),
          `id=${this.id}`,
        ).then(res => {
          if (res.data.code === 0) {
            this.express_info = res.data.express_info;
          }
        }).catch(err => {
          this.$message('对不起，请稍后重试');
        })
      },
      // 订单操作 查看
      see_order(id) {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/return_view'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.after_info = res.data.after_info;
              this.order_info = res.data.order_info;
              this.order_goods = res.data.goods_info;
              if (res.data.after_info.seller_info) {
                this.seller_info = res.data.after_info.seller_info;
              } else {
                this.seller_info = {
                  seller_name: '',
                  location: '',
                  seller_zip: '',
                  seller_mobile: '',
                  seller_phone: '',
                }
              }
            }
          }).catch(err => {
            reject(err);
          })
        })
      },
      // 审核处理
      handle_refund(val) {
        if (val == 2) {
          if (this.adjust_note) {
            this.sendHandle(val)
          } else {
            this.$message('请输入处理意见')
          }
        } else if (!this.adjust_note) {
          this.$message('请输入处理意见')
        } else if (!this.province_id) {
          this.$message('请选择省份')
        } else if (!this.city_id) {
          this.$message('请选择城市')
        } else if (!this.county_id) {
          this.$message('请选择区县')
        } else if (!this.addr) {
          this.$message('请填写详细地址')
        } else if (!this.seller_info.seller_name) {
          this.$message('请填写收货人姓名')
        } else if (!this.seller_info.seller_mobile) {
          this.$message('请填写收货人联系方式')
        } else {
          this.sendHandle(val)
        }
      },
      // 发送审核结果
      sendHandle(val) {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/return_verify'),
            this.dafa({
              id: this.id,
              result: val,
              handling_idea: this.adjust_note,
              province: this.province_id,
              city: this.city_id,
              county: this.county_id,
              addr: this.addr,
              zip: this.seller_info.seller_zip,
              name: this.seller_info.seller_name,
              phone: this.seller_info.seller_phone,
              mobile: this.seller_info.seller_mobile,
            })
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.dialogVisible = false;
              this.get_order_return();
            }
          }).catch(err => {
            reject(err);
          })
        })
      },
      // 收货|拒签
      handle_2_3() {
        if (this.handling_idea) {
          this.antiShake.antiShake((resolve, reject) => {
            axiox.post(this.getApi('root/auth/return_receipt'),
              this.dafa({
                id: this.id,
                type: this.val == 2 ? 1 : 2,
                handling_idea: this.handling_idea
              })
            ).then(res => {
              resolve(res);
              if (res.data.code === 0) {
                this.dialogVisible = false;
                this.get_order_return();
              }
            }).catch(err => {
              reject(err);
            })
          })
        } else {
          this.$message('请输入操作备注')
        }
      },
      // 换货发货信息
      return_good() {
        axiox.post(this.getApi('root/auth/return_send_page'),
          `id=${this.id}`
        ).then(res => {
          if (res.data.code === 0) {
            if (res.data.accept_info) {
              this.re_info = res.data.accept_info;
              this.province_id = res.data.accept_info.province_id;
              this.city_id = res.data.accept_info.city_id;
              this.county_id = res.data.accept_info.county_id;
              this.province = [{'id': res.data.accept_info.province_id, 'name': res.data.accept_info.province_name}];
              this.city = [{'id': res.data.accept_info.city_id, 'name': res.data.accept_info.city_name}];
              this.county = [{'id': res.data.accept_info.county_id, 'name': res.data.accept_info.county_name}];
            } else {
              this.re_info = {
                accept_name: '',
                mobile: '',
                phone: '',
                zip: '',
                province_id: '',
                province_name: '',
                city_id: '',
                city_name: '',
                county_id: '',
                county_name: '',
                addr: '',
              }
            }
            // 渲染结束再开启地址请求权限
            this.$nextTick(() => {
              this.next = true
            })
          }
        }).catch(err => {
          this.$message('对不起！请稍后再试')
        })
      },
      // 换货发货发货
      to_return_good() {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/return_send_act'),
            this.dafa({
              id: this.id,
              express_company_id: this.re_express_company_id,
              express_no: this.re_express_no,
              handling_idea: this.re_handling_idea,
              accept_name: this.re_info.accept_name,
              mobile: this.re_info.mobile,
              phone: this.re_info.phone,
              zip: this.re_info.zip,
              province: this.province_id,
              city: this.city_id,
              county: this.county_id,
              addr: this.re_info.addr
            })
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.dialogVisible = false;
              this.get_order_return();
            }
          }).catch(err => {
            reject(err);
          })
        })
      },
      // 完成
      ret_ok() {
        this.$confirm.prompt('请输入处理意见', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          axiox.post(this.getApi('root/auth/return_refund'),
            this.dafa({
              id: this.id,
              handling_idea: value
            })
          ).then(res => {
            if (res.data.code === 0) {
              this.get_order_return();
              this.$message(res.data.msg)
            } else {
              this.$message(res.data.msg)
            }
          }).catch((err) => {
            this.$message('对不起！请稍后再试')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
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
      },
      // 获取物流公司
      get_WL() {
        axiox.post(this.getApi('root/auth/express_company_list')
        ).then(res => {
          if (res.data.code === 0) {
            this.express_company = res.data.list
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.$message('对不起！请稍后再试')
        })
      },
      // 查看大图
      see_big_img(val) {
        this.see_img = true;
        this.img_big = val
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
    height: 38px;
    line-height: 38px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

  /*
    .order-info-ul .textarea-box {
      width: 100%;
    }
  */

  .order-info .el-input {
    width: 260px;
  }

  .el-table img {
    width: 62px;
    height: 35px;
  }

  .order-info-ul img {
    width: 35px;
    height: 35px;
    vertical-align: bottom;
  }

  .dialog-footer .el-button {
    width: 140px;
  }

  .cee-big-img {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 400px;
    height: 600px;
    padding: 5px 5px 50px;
    background-color: #ff4d51;
    z-index: 9999;
  }

  .cee-big-img img {

  }

  .cee-big-img .el-button {
    width: 120px;
    position: absolute;
    right: 20px;
    bottom: 15px;
  }

  .el-ipt-m .el-input {
    width: 240px;
  }

  .large-li .el-input {
    width: 430px;
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
