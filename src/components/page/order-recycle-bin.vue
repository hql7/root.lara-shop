<template>
  <div class="order-list prop-box">
    <!--订单列表-->
    <div class="m-order-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>订单列表
        <el-button type="text" icon="plus" size="small" class="out-data-btn add-btn" @click="out_data()">导出数据
        </el-button>
      </h2>
      <h2 class="large-search">
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
          <el-select class="sele-s" v-model="order_type" placeholder="订单类型" :clearable="true">
            <el-option label="普通订单" value="0"></el-option>
            <el-option label="团购订单" value="1"></el-option>
            <el-option label="限时抢购" value="2"></el-option>
            <el-option label="捆绑促销" value="3"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="payment" placeholder="支付方式" :clearable="true">
            <el-option label="账户余额" value="0"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="status" placeholder="订单状态" :clearable="true">
            <el-option label="等待审核" value="0"></el-option>
            <el-option label="已审核" value="3"></el-option>
            <el-option label="已完成" value="4"></el-option>
            <el-option label="已取消" value="5"></el-option>
            <el-option label="已作废" value="6"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="pay_status" placeholder="支付状态" :clearable="true">
            <el-option label="未付款" value="0"></el-option>
            <el-option label="已付款" value="1"></el-option>
            <el-option label="申请退款" value="2"></el-option>
            <el-option label="已退款" value="3"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="delivery_status" placeholder="配送状态" :clearable="true">
            <el-option label="未发货" value="0"></el-option>
            <el-option label="已发货" value="1"></el-option>
            <el-option label="已签收" value="2"></el-option>
            <el-option label="申请退货" value="3"></el-option>
            <el-option label="已退货" value="4"></el-option>
            <el-option label="申请换货" value="5"></el-option>
            <el-option label="已换货" value="6"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
            <el-option label="订单编号" value="0"></el-option>
            <el-option label="会员账号" value="1"></el-option>
            <el-option label="收货人姓名" value="2"></el-option>
            <el-option label="收货人电话" value="3"></el-option>
          </el-select>
          <el-input placeholder="根据类型搜索关键词" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_order"></el-button>
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
              <el-button type="primary" icon="setting" size="small">处理</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0"><i class="iconfont icon-chakan-copy"></i>&nbsp;查看</el-dropdown-item>
                <el-dropdown-item command="1"><i class="iconfont icon-huifu-copy"></i>&nbsp;恢复</el-dropdown-item>
                <el-dropdown-item command="2"><i class="iconfont icon-shanchu"></i>&nbsp;删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_no"
          label="订单号"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="order_amount"
          label="商品总额"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="username"
          label="会员账号"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="accept_name"
          label="收货人"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="收货人电话"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="payment"
          label="支付方式"
          min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.payment == 1 ">账户余额</span>
            <span v-else>其他</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="支付状态"
          min-width="100">
          <template slot-scope="scope">
            <span class="c-danger" v-if="scope.row.pay_status == 0 ">未付款</span>
            <span class="c-success" v-else-if="scope.row.pay_status == 1 ">已付款</span>
            <span class="c-warning" v-else-if="scope.row.pay_status == 2 ">申请退款</span>
            <span class="c-999" v-else>已退款</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="delivery_status"
          label="配送状态"
          min-width="100">
          <template slot-scope="scope">
            <span class="c-warning" v-if="scope.row.delivery_status == 0 ">未发货</span>
            <span class="c-blue" v-else-if="scope.row.delivery_status == 1 ">已发货</span>
            <span class="c-success" v-else-if="scope.row.delivery_status == 2 ">已签收</span>
            <span class="c-warning" v-else-if="scope.row.delivery_status == 3 ">申请退货</span>
            <span class="c-999" v-else-if="scope.row.delivery_status == 4 ">已退货</span>
            <span class="c-warning" v-else-if="scope.row.delivery_status == 5 ">申请换货</span>
            <span class="c-999" v-else>已换货</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="订单状态"
          min-width="100">
          <template slot-scope="scope">
            <span class="c-blue" v-if="scope.row.status == 0 ">等待审核</span>
            <span class="c-blue" v-else-if="scope.row.status == 1 ">等待审核</span>
            <span class="c-blue" v-else-if="scope.row.status == 2 ">等待审核</span>
            <span class="c-success" v-else-if="scope.row.status == 3 ">已审核</span>
            <span class="c-999" v-else-if="scope.row.status == 4 ">已完成</span>
            <span class="c-999" v-else-if="scope.row.status == 5 ">已取消</span>
            <s class="c-danger" v-else>已作废</s>
          </template>
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
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <!--<el-tooltip class="item" effect="dark" content="如分类下有下级分类或商品，自动过滤不删除" placement="top-start">-->
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="info"
                   @click="del_order(1,'all')">一键恢复
        </el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_order(2,'all')">一键删除
        </el-button>
        <!--</el-tooltip>-->
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--操作-->
    <el-dialog
      title="查看订单"
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
        <!-- <div class="fa-huo" v-if="to_do ==1">
           <h3>发货信息：</h3>
           <el-form :model="ruleForm" :rules="rules" :show-message="false" ref="ruleForm" label-width="120px"
                    class="demo-ruleForm">
             <el-form-item label="订单编号：">
               {{ruleForm.order_no}}
             </el-form-item>
             <el-form-item label="下单时间：">
               {{ruleForm.create_time}}
             </el-form-item>
             <el-form-item label="支付方式：">
               {{ruleForm.payname}}
             </el-form-item>
             <el-form-item label="配送费用：">
               <em>{{ruleForm.payable_freight}}</em>
             </el-form-item>
             <el-form-item label="物流公司：" prop="express_company_id">
               <el-select v-model="ruleForm.express_company_id" placeholder="请选择物流" @visible-change="get_express">
                 <el-option v-for="item in express" :label="item.name" :key="item.id" :value="item.id"></el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="物流单号：" prop="express_no">
               <el-input v-model="ruleForm.express_no" placeholder="请输入物流单号"></el-input>
             </el-form-item>
             <el-form-item label="收货人姓名：" prop="accept_name">
               <el-input v-model="ruleForm.accept_name" placeholder="请输入收货人姓名"></el-input>
             </el-form-item>
             <el-form-item label="联系手机：" prop="mobile">
               <el-input v-model="ruleForm.mobile" placeholder="请输入手机号"></el-input>
             </el-form-item>
             <el-form-item label="联系电话：">
               <el-input v-model="ruleForm.phone" placeholder="请输入电话号"></el-input>
             </el-form-item>
             <el-form-item label="邮编：">
               <el-input v-model="ruleForm.zip" placeholder="请输入邮编"></el-input>
             </el-form-item>
             <el-form-item label="收货地区：">
               <el-col :span="7">
                 <el-form-item prop="province">
                   <el-select v-model="ruleForm.province" filterable placeholder="选择省份" @visible-change="get_province"
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
               <el-col class="lian-jie" :span="1">-</el-col>
               <el-col :span="7">
                 <el-form-item prop="city">
                   <el-select v-model="ruleForm.city" filterable placeholder="选择城市" @change="get_county">
                     <el-option
                       v-for="item in city"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
                     </el-option>
                   </el-select>
                 </el-form-item>
               </el-col>
               <el-col class="lian-jie" :span="1">-</el-col>
               <el-col :span="7">
                 <el-form-item prop="county">
                   <el-select v-model="ruleForm.county" filterable placeholder="选择区县">
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
             <el-form-item label="街道地址：" prop="addr">
               <el-input v-model="ruleForm.addr" placeholder="请输入详细地址"></el-input>
             </el-form-item>
             <el-form-item label="用户备注：">
               {{ruleForm.user_remark}}
             </el-form-item>
             <el-form-item label="发货单备注：">
               <el-input v-model="ruleForm.remark" placeholder="请输入发货单备注"></el-input>
             </el-form-item>
           </el-form>
         </div>-->
        <div class="m-see">
          <h3>购买人信息：</h3>
          <ul class="bay-user order-info-ul">
            <li><span>用户名：</span>{{buy_user.username}}</li>
            <li><span>姓名：</span>{{buy_user.realname}}</li>
            <li><span>手机：</span>{{buy_user.mobile}}</li>
            <li><span>电话：</span>{{buy_user.phone}}</li>
            <li><span>邮箱：</span>{{buy_user.email}}</li>
            <li><span>地址：</span>{{buy_user.addr}}</li>
          </ul>
          <h3>订单信息：</h3>
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
            <li class="el-ipt-m"><span>订单折扣或涨价金额：</span>
              <!--<el-tooltip class="item" effect="dark" content="例：想给顾客降价10元，就输入-10；想涨价10元，就输入10" placement="top-start">-->
              <el-input
                v-model="order_info.adjust_amount"
                placeholder="0.00"></el-input>
              <!--</el-tooltip>-->
            </li>
            <li><span>调整后订单总金额：</span>{{order_info.order_amount}}</li>
            <li><span>用户备注：</span>{{order_info.user_remark}}</li>
            <li><span>管理人员备注：</span>{{order_info.admin_remark}}</li>
            <li class="textarea-box"><span>调价原因：</span>
              <el-input class="adjust_note" type="textarea"
                        :rows="2" v-model="order_info.adjust_note" placeholder="请输入内容"></el-input>
            </li>
          </ul>
          <h3>收货人信息：</h3>
          <!--   <el-form :model="accept_info" :rules="rules" ref="accept_info" label-width="160px" class="demo-ruleForm">
               <el-form-item label="收货人姓名：" prop="name">
                 <el-input v-model="accept_info.accept_name"></el-input>
               </el-form-item>
               <el-form-item label="收货人手机：" prop="mobile">
                 <el-input v-model="accept_info.mobile"></el-input>
               </el-form-item>
               &lt;!&ndash;   <el-form-item label="收货人电话：" prop="phone">
                    <el-input v-model="accept_info.phone"></el-input>
                  </el-form-item>
                  <el-form-item label="邮编：" prop="zip">
                    <el-input v-model="accept_info.zip"></el-input>
                  </el-form-item>&ndash;&gt;
               &lt;!&ndash;  <el-form-item label="收货地址：">
                   <el-col :span="7">
                     <el-form-item prop="date1">
                       <el-select v-model="province_id" filterable placeholder="选择省份" @visible-change="get_province"
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
                   <el-col :span="7">
                     <el-form-item prop="date2">
                       <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
                     </el-form-item>
                   </el-col>
                   <el-col :span="7">
                     <el-form-item prop="date2">
                       <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
                     </el-form-item>
                   </el-col>
                 </el-form-item>&ndash;&gt;
               <el-form-item label="详细街道地址：" prop="addr">
                 <el-input v-model="accept_info.addr"></el-input>
               </el-form-item>
             </el-form>-->
          <ul class="get-user order-info-ul el-ipt-m">
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
              <el-select v-model="province_id" filterable placeholder="选择省份">
                <el-option
                  v-for="item in province"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="city_id" filterable placeholder="选择城市">
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
              <!--<em v-if="!province_id || !city_id || !county_id">请选择完整地区信息</em>-->
            </li>
            <li class="large-li"><span>详细街道地址：</span>
              <el-input
                v-model="accept_info.addr"></el-input>
              <!--<em v-if="!accept_info.addr">请填写详细地址</em>-->
            </li>
          </ul>
        </div>
      </div>
      <!--  <div class="bei-zhu" v-else-if="to_do==3 || to_do==5">
          <h3>备注信息：</h3>
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="remarks">
          </el-input>
        </div>-->
      <!--<span slot="footer" class="dialog-footer">
        <el-button v-if="to_do==2" type="primary" @click="to_do_ok">保 存</el-button>
        <el-button v-else-if="to_do==1" type="primary" @click="to_do_ok('ruleForm')">发 货</el-button>
        <el-button v-else-if="to_do==3 || to_do==5" type="primary" @click="to_do_ok">保 存</el-button>
      </span>-->
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
          content: `点击处理按钮将显示查看订单（包括订单物品）的详细信息。`
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
        type: 0, // 订单类型    0=自营订单列表   1=商家订单列表
        is_del: 1, // 是否在回收站中 0=正常  1=回收站
        start_time: '', // 起始时间
        end_time: '', // 截止时间
        order_type: '', // 订单类型  0=普通订单  1=团购订单  2=限时抢购  3= 捆绑促销
        payment: '', // 支付方式  获取支付方式列表  传过来的是ID
        status: '', // 订单状态  0=1=2=等待审核 3=已审核 4=已完成 5=已取消 6=已作废
        pay_status: '', // 支付状态  0=未付款 1=已付款 2=申请退款 3=已退款
        delivery_status: '', // 配送状态  0=未发货 1=已发货 2=已签收 3=申请退货 4=已退货 5=申请换货 6=已换货
        search_type: '', // 搜索类型  0=订单编号 1=会员账号 2=收货人姓名 3=收货人电话
        search_str: '', // 搜索关键字
        multipleSelection: [], // 选中列
        dialogVisible: false, // 弹出组件
        order_goods: {}, // 订单内商品信息
        buy_user: {}, // 购买人信息
        order_info: {}, // 订单信息
        accept_info: {}, // 收货人信息
        next: false, // 修复地址请求
        province_id: '', // 省份id
        province: [], // 省份列表
        city_id: '', // 城市id
        city: [], // 城市列表
        county_id: '', // 区县id
        county: [], // 区县列表
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_order()
    },
    methods: {
      // 监听子分页组件 翻页
      to_page() {
        this.get_order()
      },
      // 获取订单列表
      get_order() {
        window.axiox.post(this.getApi('root/auth/order_list'),
          this.dafa({
            type: this.type,
            is_del: this.is_del,
            index: this.index,
            start_time: this.start_time,
            end_time: this.end_time,
            order_type: this.order_type,
            payment: this.payment,
            status: this.status,
            pay_status: this.pay_status,
            delivery_status: this.delivery_status,
            search_type: this.search_type,
            search_str: this.search_str
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.orders;
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
      },
      // 订单操作
      handle(val, id) {
        this.id = id;
        switch (val) {
          case '0' :
            this.dialogVisible = true;
            this.see_oeder_info();
            break;
          case '1':
            this.del_order(val, id);
            break;
          case '2':
            this.del_order(val, id);
            break;
        }
      },
      // 操作结束
      to_do_ok(formName) {
        // 编辑操作
        if (this.to_do == 2) {
          this.orderSave();
        } else if (this.to_do == 1) { // 发货操作
          this.sendGoods(formName);
        } else if (this.to_do == 3 || this.to_do == 5) {  // 作废 || 备注 订单
          this.toVoidRemarks
        } else {
          this.$message('请填写备注信息')
        }
      },
      // 编辑保存
      orderSave() {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/order_save'),
            this.dafa({
              id: this.id,
              adjust_amount: this.order_info.adjust_amount,
              adjust_note: this.order_info.adjust_note,
              accept_name: this.accept_info.accept_name,
              mobile: this.accept_info.mobile,
              phone: this.accept_info.phone,
              zip: this.accept_info.zip,
              addr: this.accept_info.addr,
              province: this.province_id,
              city: this.city_id,
              county: this.county_id
            })
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.dialogVisible = false;
              this.to_do = null;
              this.get_order()
            }
          }).catch(err => {
            reject(err);
            console.log(err);
          })
        })
      },
      // 发货
      sendGoods(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              axiox.post(this.getApi('root/auth/order_ship'),
                this.dafa({
                  order_id: this.id,
                  order_no: this.ruleForm.order_no,
                  express_company_id: this.ruleForm.express_company_id,
                  express_no: this.ruleForm.express_no,
                  accept_name: this.ruleForm.accept_name,
                  mobile: this.ruleForm.mobile,
                  phone: this.ruleForm.phone,
                  zip: this.ruleForm.zip,
                  province: this.ruleForm.province,
                  city: this.ruleForm.city,
                  county: this.ruleForm.county,
                  addr: this.ruleForm.addr,
                  remark: this.ruleForm.remark
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.dialogVisible = false;
                  this.to_do = null;
                  this.get_order()
                }
              }).catch(err => {
                reject(err);
                console.log(err);
              })
            })
          } else {
            this.$message('请检查输入信息是否有误');
            return false;
          }
        });
      },
      // 作废 || 备注 订单
      toVoidRemarks() {
        if (this.remarks) {
          this.antiShake.antiShake((resolve, reject) => {
            axiox.post(this.getApi('root/auth/order_act'),
              this.dafa({
                id: this.id,
                type: this.to_do == 3 ? 2 : 3,
                admin_remark: this.remarks
              })
            ).then(res => {
              resolve(res);
              if (res.data.code === 0) {
                this.dialogVisible = false;
                this.to_do = null;
                this.get_order()
              }
            }).catch(err => {
              reject(err);
            })
          })
        }
      },
      // 查看订单信息
      see_oeder_info() {
        this.antiShake.antiShake((resolve, reject) => {
          axiox.post(this.getApi('root/auth/order_view'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              // 商品信息
              this.order_goods = res.data.order_goods;
              // 购买人信息
              this.buy_user = res.data.buy_user;
              // 订单信息
              this.order_info = res.data.order_info;
              // 收货人信息
              this.accept_info = res.data.accept_info;
              // 处理省市县数据格式
              this.province_id = res.data.accept_info.province_id;
              this.province.push({
                id: res.data.accept_info.province_id,
                name: res.data.accept_info.province_name,
              });
              this.city_id = res.data.accept_info.city_id;
              this.city.push({
                id: res.data.accept_info.city_id,
                name: res.data.accept_info.city_name,
              });
              this.county_id = res.data.accept_info.county_id;
              this.county.push({
                id: res.data.accept_info.county_id,
                name: res.data.accept_info.county_name,
              })

              /* // 渲染结束再开启地址请求权限
               this.$nextTick(() => {
               this.next = true
               })*/
            }
          }).catch(error => {
            reject(error);
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
      // 检出回收站
      del_order(val, index, rows) {
        let title = val == 1 ? '是否确认将此订单从回收站回复?' : '是否确认将此订单从回收站删除?';
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (index === 'all') {
            this.multipleSelection.forEach(item => {
              this.del_id.push(item.id)
            })
          } else {
            this.del_id.push(rows[index].id)
          }
          // 恢复或删除
          if (val == 1) {
            axiox.post(this.getApi('root/auth/order_recover'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              if (res.data.code === 0) {
                this.get_order()
                this.$message(res.data.msg)
                this.del_id = []
              } else {
                this.$message(res.data.msg)
                this.toggleSelection()
                this.del_id = []
              }
            }).catch((err) => {
//            console.log(err)
              this.$message('对不起！请稍后再试')
              this.toggleSelection()
              this.del_id = []
            })
          } else {
            axiox.post(this.getApi('root/auth/order_del'),
              this.dafa({
                id_list: this.del_id,
                real_del: 1
              })
            ).then(res => {
              if (res.data.code === 0) {
                this.get_order()
                this.$message(res.data.msg)
                this.del_id = []
              } else {
                this.$message(res.data.msg)
                this.toggleSelection()
                this.del_id = []
              }
            }).catch((err) => {
//            console.log(err)
              this.$message('对不起！请稍后再试')
              this.toggleSelection()
              this.del_id = []
            })
          }
        }).catch(() => {
          this.toggleSelection()
          this.del_id = []
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 导出数据
      out_data() {
      }
    },
    watch: {
      // 监视地址请求权限
      dialogVisible(val) {
        if (!val) {
          this.next = false
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

  .el-table img {
    width: 62px;
    height: 35px;
  }

  .el-ipt-m .el-input {
    width: 240px;
  }

  .large-li .el-input {
    width: 430px;
  }

  .sele-box .el-select {
    width: 140px;
  }

  .dialog-footer .el-button {
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

</style>
