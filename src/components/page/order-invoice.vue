<template>
  <div class="order-receipt-list prop-box">
    <!--发货单列表-->
    <div class="m-order-receipt-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <!-- <h2>收款单列表
        &lt;!&ndash; <el-button type="text" icon="plus" size="small" class="out-data-btn add-btn" @click="out_data()">导出数据
         </el-button>&ndash;&gt;
       </h2>-->
      <h2 class="large-search">
        发货单列表
        <div class="u-right">
          <el-select class="sele-s" v-model="express_company_id" placeholder="物流公司" @visible-change="get_express"
                     :clearable="true">
            <el-option v-for="item in express" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型" :clearable="true">
            <el-option label="发货单号" value="0"></el-option>
            <el-option label="订单号" value="1"></el-option>
            <el-option label="物流单号" value="2"></el-option>
            <el-option label="收货人" value="3"></el-option>
            <el-option label="收货人电话" value="4"></el-option>
          </el-select>
          <el-input placeholder="根据类型搜索关键词" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_order_invoice"></el-button>
          </el-input>
        </div>
      </h2>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        stripe
        ref="multipleTable">
        <!-- <el-table-column
           type="selection"
           width="55">
         </el-table-column>-->
        <el-table-column
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-button type="danger" size="small" icon="el-icon-search" @click="see_order(scope.row.id)">查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="invoice_no"
          label="发货单号"
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
          prop="order_no"
          label="订单号"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="express_no"
          label="物流单号"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="express_company"
          label="物流公司"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="accept_name"
          label="收货人"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="收货人手机"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
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
      title="查看发货单"
      :visible.sync="dialogVisible"
      width="80%">
      <div class="see">
        <h3>发货单详情：</h3>
        <ul class="order-info order-info-ul">
          <li><span>发货单号：</span>{{invoice.invoice_no}}</li>
          <li><span>订单类型：</span><em v-if="invoice.type==3">捆绑促销</em><em v-else-if="invoice.type==1">团购订单</em><em
            v-else-if="invoice.type==2">限时抢购</em><em v-else>普通订单</em></li>
          <li><span>订单编号：</span>{{invoice.order_no}}</li>
          <li><span>物流单号：</span>{{invoice.express_no}}</li>
          <li><span>物流公司：</span>{{invoice.express_company}}</li>
          <li><span>收货人：</span>{{invoice.accept_name}}</li>
          <li><span>收货人手机：</span>{{invoice.mobile}}</li>
          <li><span>收货人电话：</span>{{invoice.phone}}</li>
          <li><span>邮编：</span>{{invoice.zip}}</li>
          <li><span>发货时间：</span>{{invoice.create_time}}</li>
          <li><span>发货人：</span>{{invoice.admin}}</li>
          <li><span>收货地址：</span>{{invoice.accept_addr}}</li>
          <!--<li><span>付款时间：</span>{{order_info.pay_time}}</li>-->
          <!--<li><span>用户备注：</span>{{order_info.user_remark}}</li>-->
        </ul>
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
        <!--<h3>收货人信息：</h3>-->
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
    </el-dialog>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  import crumb from '../common/crumb.vue'
  import page from '../common/page.vue'

  export default {
    data () {
      return {
        hint: {
          title: '操作提示',
          content: `点击查看订单将显示订单（包括订单物品）的详细信息。`
        }, // 提示模块参数
        totalPage: 1, // 总页
        tableData: [], // 表格数据
        search_type: '', // 搜索类型  0=发货单号 1=订单号 2=物流单号 3=收货人 4=收货人电话
        express_company_id: '', // 所选物流
        express: [], // 物流公司
        search_str: '', // 搜索关键字
        dialogVisible: false, // 弹出组件
        invoice: {}, // 订单信息
        order_goods: {}, // 商品信息
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created () {
      this.get_order_invoice()
    },
    methods: {
      // 监听子分页组件 翻页
      to_page () {
        this.get_order_invoice()
      },
      // 获取发货单列表
      get_order_invoice () {
        window.axiox.post(this.getApi('root/auth/invoice_list'),
          this.dafa({
            index: this.index,
            express_company_id: this.express_company_id,
            search_type: this.search_type,
            search_str: this.search_str
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.list;
            this.totalPage = res.data.fy_pgCount;
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message('对不起！请稍后再试')
        })
      },
      // 订单操作
      see_order (id) {
        this.dialogVisible = true;
        axiox.post(this.getApi('root/auth/invoice_view'),
          `id=${id}`
        ).then(res => {
          if (res.data.code === 0) {
            this.invoice = res.data.list;
            this.order_goods = res.data.list.order_goods
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.$message('对不起！请稍后再试')
        })
      },
      // 获取物流公司
      get_express(val){
        if (val) {
          axiox.post(this.getApi('root/auth/express_company_list')
          ).then(res => {
            if (res.data.code === 0) {
              this.express = res.data.list
            } else {
              this.$message(res.data.msg)
            }
          }).catch(err => {
            this.$message('对不起！请稍后再试')
          })
        }
      }
    },
    computed: {
      index(){
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
   */
</style>
