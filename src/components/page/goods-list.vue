<template>
  <div class="goods-list prop-box">
    <!--商品列表-->
    <div class="m-goods-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>商品列表
        <el-button type="text" icon="plus" size="small" class="add-role-btn add-btn" @click="edit_good('')">
          添加商品
        </el-button>
        <div class="u-right">
          <el-select class="sele-s" @change="getFL($event,1,'s')"
                     v-model="category_id1" placeholder="一级分类">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in classify1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select class="sele-s" v-model="category_id2" placeholder="二级分类">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in classify2"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select class="sele-s" v-model="search_type" placeholder="搜索类型">
            <el-option
              v-for="item in search_types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input class="search"
                    placeholder="根据类型搜索关键词"
                    v-model="search">
            <el-button slot="append" icon="el-icon-search" @click="get_goods(true)"></el-button>
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
          prop="id"
          label="商品ID"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          min-width="260">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="no"
          label="编号"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="category_name"
          label="分类"
        >
        </el-table-column>
        <el-table-column
          prop="sell_price"
          label="零售价"
        >
        </el-table-column>
        <el-table-column
          prop="market_price"
          label="市场价"
        >
        </el-table-column>
        <el-table-column
          prop="cost_price"
          label="成本价"
        >
        </el-table-column>
        <el-table-column
          prop="store_nums"
          label="库存"
        >
        </el-table-column>
        <el-table-column
          prop="is_online"
          label="商品状态">
          <template slot-scope="scope">
            <span v-if="scope.row.is_online == 0 ">在售</span>
            <span v-else>下架</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_new"
          label="是否新品">
          <template slot-scope="scope">
            <span v-if="scope.row.is_new == 0 ">是</span>
            <span v-else>不是</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_hot"
          label="是否热卖">
          <template slot-scope="scope">
            <span v-if="scope.row.is_hot == 0 ">是</span>
            <span v-else>不是</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_commend"
          label="是否推荐">
          <template slot-scope="scope">
            <span v-if="scope.row.is_commend == 0 ">是</span>
            <span v-else>不是</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          width="60">
        </el-table-column>
        <el-table-column
          prop="shop"
          label="店铺名称">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          min-width="280">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_good(scope.row.id)">
              编辑
            </el-button>
            <el-button v-if="scope.row.is_online == 1" type="success" size="small"
                       icon="delete"
                       @click="down_sell(scope.row.id,0)">上架
            </el-button>
            <el-button v-else type="warning" size="small" icon="delete"
                       @click="down_sell(scope.row.id,1)">下架
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_good(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="success"
                   @click="down_sell('all',0)">
          上架
        </el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="warning"
                   @click="down_sell('all',1)">
          下架
        </el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_good('all')">删除
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--添加商品-->
    <div class="add-good prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <hint :title="hint.title" :content="hint.content"></hint>
      <el-tabs type="border-card">
        <el-tab-pane label="基本信息">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
            <!--<el-form-item label="商品类型">
              <el-select v-model="ruleForm.goods_type" placeholder="请选择商品类型">
                <el-option label="实物商品" :value="0"></el-option>
                <el-option label="虚拟商品" :value="1"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="商品分类" required class="col_box">
              <el-col :span="4">
                <el-form-item prop="goods_cly_1" class="el-form-item-no">
                  <el-tooltip class="item" effect="dark" content="最多成为第三级,如果要设置为第二级, 只选择第一级即可"
                              placement="top-start">
                    <el-select class="sele-s" @change="getFL($event,1,'e')"
                               v-model="ruleForm.goods_cly_1"
                               placeholder="顶级分类">
                      <el-option label="请选择" value="" disabled></el-option>
                      <el-option v-for="item in level1" :key="item.id" :label="item.name"
                                 :value="item.id"></el-option>
                    </el-select>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="goods_cly_2" class="el-form-item-no">
                  <el-tooltip class="item" effect="dark" content="最多成为第三级,如果要设置为第二级, 只选择第一级即可"
                              placement="top-start">
                    <el-select class="sele-s" @change="getFL($event,2,'e')" v-model="ruleForm.goods_cly_2"
                               placeholder="二级分类">
                      <el-option label="请选择" value="" disabled></el-option>
                      <el-option v-for="item in level2" :key="item.id" :label="item.name"
                                 :value="item.id"></el-option>
                    </el-select>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="goods_cly_3" class="el-form-item-no">
                  <el-tooltip class="item" effect="dark" content="最多成为第三级,如果要设置为第二级, 只选择第一级即可"
                              placement="top-start">
                    <el-select class="sele-s" v-model="ruleForm.goods_cly_3" placeholder="三级分类">
                      <el-option label="请选择" value="" disabled></el-option>
                      <el-option v-for="item in level3" :key="item.id" :label="item.name"
                                 :value="item.id"></el-option>
                    </el-select>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <!--<el-input class="u-ts" :disabled="true" value="最多成为第三级,如果设置为第二级, 只选择第一级即可"></el-input>-->
            </el-form-item>
            <el-form-item label="产品类型">
              <el-select v-model="ruleForm.product_type" @change="change_type" placeholder="请选择产品类型">
                <el-option v-for="item in gt_list" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌">
              <el-select v-model="ruleForm.brand_type" placeholder="请选择品牌类型">
                <el-option v-for="item in brand_list" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
              <el-input v-if="!brand_list" disabled
                        placeholder="此类型暂无品牌！请先至品牌管理添加"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="detail.name">
              <el-input v-model="ruleForm.detail.name"></el-input>
            </el-form-item>
            <el-form-item label="商品副标题">
              <el-input v-model="ruleForm.detail.subtitle"></el-input>
            </el-form-item>
            <el-form-item label="商品关键词">
              <el-input v-model="ruleForm.detail.keywords"></el-input>
            </el-form-item>
            <el-form-item label="商品编号" prop="detail.goods_no">
              <el-tooltip class="item" effect="dark" content="开启规格后的货号根据编号生成,如若开启规格请务必先填写"
                          placement="top-start">
                <el-input v-model="ruleForm.detail.goods_no"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="是否包邮">
              <el-switch
                v-model="ruleForm.detail.free_ship"
                active-color="#13ce66"
                inactive-color="#ccc"
                active-text="是"
                inactive-text="否"
                :active-value="0"
                :inactive-value="1">
              </el-switch>
            </el-form-item>
            <el-form-item label="快递费用">
              <el-tooltip class="item" effect="dark" content="如果快递费用为0则默认按商品重量计算运费"
                          placement="top-start">
                <el-input v-model="ruleForm.detail.ship_money"></el-input>
              </el-tooltip>
            </el-form-item>
            <div class="point-box">
              <h3>
                <!--<el-tooltip class="item" effect="dark" content="购买此商品会赠送多少积分" placement="top-start">
                  <span>赠送积分</span>
                </el-tooltip>-->
                <el-tooltip class="item" effect="dark" content="购买此商品可以使用多少积分抵扣"
                            placement="top-start">
                  <span>可用积分</span>
                </el-tooltip>
                <span>排序</span>
                <span>计量单位</span>
                <span>是否上架</span>
                <span>设为推荐</span>
                <span>推送至新品区</span>
                <span>推送至热卖区</span>
              </h3>
              <h5>
                <!--<span><el-input v-model="ruleForm.detail.point"></el-input></span>-->
                <span><el-input v-model="ruleForm.detail.exchange_point"></el-input></span>
                <span><el-input v-model="ruleForm.detail.sort"></el-input></span>
                <span><el-input v-model="ruleForm.detail.unit"></el-input></span>
                <span>
                    <el-switch
                      v-model="ruleForm.detail.is_online"
                      active-color="#13ce66"
                      inactive-color="#ccc"
                      active-text="是"
                      inactive-text="否"
                      :active-value="0"
                      :inactive-value="1">
                    </el-switch>
                  </span>
                <span>
                    <el-switch
                      v-model="ruleForm.detail.is_commend"
                      active-color="#13ce66"
                      inactive-color="#ccc"
                      active-text="是"
                      inactive-text="否"
                      :active-value="0"
                      :inactive-value="1">
                    </el-switch>
                  </span>
                <span>
                    <el-switch
                      v-model="ruleForm.detail.is_new"
                      active-color="#13ce66"
                      inactive-color="#ccc"
                      active-text="是"
                      inactive-text="否"
                      :active-value="0"
                      :inactive-value="1">
                    </el-switch>
                  </span>
                <span>
                    <el-switch
                      v-model="ruleForm.detail.is_hot"
                      active-color="#13ce66"
                      inactive-color="#ccc"
                      active-text="是"
                      inactive-text="否"
                      :active-value="0"
                      :inactive-value="1">
                    </el-switch>
                  </span>
              </h5>
            </div>
            <el-form-item label="商品展示图片">
              <!--<el-upload
                :action="getApi('coms/upload-img')"
                ref="upload"
                :multiple='true'
                list-type="picture-card"
                :data="{type:0}"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="on_suc"
                :on-progress="on_progress"
                :on-error="on_error"
                :before-upload="beforeImgUpload"
                :auto-upload="true"
                :file-list="fileList">
                <i class="el-icon-plus"></i>
              </el-upload>-->
              <item-upload
                :onSuccess="on_suc"
                :onRemove="handleRemove"
                :multiple="true"
                :fileList="fileList"
                :severType=0></item-upload>
              <el-dialog v-model="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <em class="c-danger">建议为正方型图片，尺寸建议宽度为480*480，如果不上传默认为第一个缩略图，仅支持jpg格式。</em>
            </el-form-item>
            <h2 class="form-title">产品规格</h2>
            <div v-if="ruleForm.products.length<=1 && specs_key.length==0 && skus.length==0">
              <div v-for="item in ruleForm.products">
                <el-form-item label="货号" prop="products[0].product_no">
                  <el-input v-model="item.product_no"></el-input>
                </el-form-item>
                <el-form-item label="库存" prop="products[0].store_nums">
                  <el-input v-model.number="item.store_nums"></el-input>
                </el-form-item>
                <el-form-item label="预警线" prop="products[0].warning_line">
                  <el-input v-model.number="item.warning_line"></el-input>
                </el-form-item>
                <el-form-item label="重量（g）" prop="products[0].weight">
                  <el-input v-model.number="item.weight"></el-input>
                </el-form-item>
                <el-form-item label="零售价" prop="products[0].sell_price">
                  <el-input v-model.number="item.sell_price"></el-input>
                </el-form-item>
                <el-form-item label="市场价" prop="products[0].market_price">
                  <el-input v-model.number="item.market_price"></el-input>
                </el-form-item>
                <el-form-item label="成本价" prop="products[0].cost_price">
                  <el-input v-model.number="item.cost_price"></el-input>
                </el-form-item>
                <el-form-item label="规格">
                  <el-button icon="plus" class="open-specs" @click="openSpec">开启规格</el-button>
                </el-form-item>
              </div>
            </div>
            <div v-else class="ggs">
              <div class="edit-gg">
                <el-button class="u-s" type="danger" icon="edit" @click="open = true">编辑规格</el-button>
              </div>
              <div class="ggs-list">
                <table id="sku_table" class="product_list_table break-word mt_0">
                  <tbody>
                  <!--  <tr>
                      <td colspan="4">
                        批量设置零售价：US $<input type="text" id="batchPrice" maxlength="9"/>

                        <input type="button"
                               @click="batchSetPrice()"
                               value="确定"/> 批量设置库存：
                        <input type="text" id="batchStockQuantity" maxlength="9"/>
                        <el-input v-model="input" placeholder="请输入内容"></el-input>
                        <input type="button"
                               @click="batchSetStockQuantity()"
                               value="确定"/>
                      </td>
                    </tr>-->
                  <tr>
                    <th>货号</th>
                    <th v-for="item in spec_list" v-if="item.selectedValues.length>0">
                      {{item.name}}
                    </th>
                    <th>库存</th>
                    <th>预警线</th>
                    <th>零售价</th>
                    <th>市场价</th>
                    <th>成本价</th>
                    <th>重量</th>
                  </tr>
                  <tr v-for="sku in skus">
                    <td class="size-s">
                      <el-input :disabled="true" v-model="sku.product_no"></el-input>
                    </td>
                    <td v-for="item in spec_list" v-if="item.selectedValues.length>0">
                      {{getValueName(sku, item)}}
                    </td>
                    <td class="size-s">
                      <!--<input type="text" v-model="sku.SkuPrice" class="w50" maxlength="9"/>-->
                      <el-input :disabled="true" v-model="sku.store_nums"></el-input>
                    </td>
                    <td class="size-s">
                      <!--<input type="text" v-model="sku.StockQuantity" class="w50" maxlength="9"/>-->
                      <el-input :disabled="true" v-model="sku.warning_line"></el-input>
                    </td>
                    <td class="size-s">
                      <!--<input type="text" v-model="sku.SkuCode" class="w180" maxlength="20"/>-->
                      <el-input :disabled="true" v-model="sku.sell_price"></el-input>
                    </td>
                    <td class="size-s">
                      <!--<input type="text" v-model="sku.SkuCode" class="w180" maxlength="20"/>-->
                      <el-input :disabled="true" v-model="sku.market_price"></el-input>
                    </td>
                    <td class="size-s">
                      <!--<input type="text" v-model="sku.SkuCode" class="w180" maxlength="20"/>-->
                      <el-input :disabled="true" v-model="sku.cost_price"></el-input>
                    </td>
                    <td class="size-s">
                      <!--<input type="text" v-model="sku.SkuCode" class="w180" maxlength="20"/>-->
                      <el-input :disabled="true" v-model="sku.weight"></el-input>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <!-- <el-table
                 :data="ruleForm.products"
                 stripe
                 style="width: 100%">
                 <el-table-column
                   label="货号"
                   min-width="220">
                   <template slot-scope="scope">
                     <el-input v-model="ruleForm.products[scope.$index].product_no"></el-input>
                   </template>
                 </el-table-column>
                 <el-table-column
                   v-for="(item, index) in spec_title"
                   :key="item.id"
                   :label="item.name"
                   min-width="140">
                   <template slot-scope="scope">
                     {{ruleForm.products[scope.$index].specs[index].value.name}}
                   </template>
                 </el-table-column>
                 <el-table-column
                   prop="store_nums"
                   label="库存"
                   min-width="100">
                   <template slot-scope="scope">
                     <el-input v-model="ruleForm.products[scope.$index].store_nums"></el-input>
                   </template>
                 </el-table-column>
                 <el-table-column
                   prop="warning_line"
                   label="预警线"
                   min-width="80">
                   <template slot-scope="scope">
                     <el-input v-model="ruleForm.products[scope.$index].warning_line"></el-input>
                   </template>
                 </el-table-column>
                 <el-table-column
                   prop="sell_price"
                   label="零售价"
                   min-width="100">
                   <template slot-scope="scope">
                     <el-input v-model="ruleForm.products[scope.$index].sell_price"></el-input>
                   </template>
                 </el-table-column>
                 <el-table-column
                   prop="market_price"
                   label="市场价"
                   min-width="100">
                   <template slot-scope="scope">
                     <el-input v-model="ruleForm.products[scope.$index].market_price"></el-input>
                   </template>
                 </el-table-column>
                 <el-table-column
                   prop="cost_price"
                   label="成本价"
                   min-width="100">
                   <template slot-scope="scope">
                     <el-input v-model="ruleForm.products[scope.$index].cost_price"></el-input>
                   </template>
                 </el-table-column>
                 <el-table-column
                   prop="weight"
                   label="重量"
                   min-width="100">
                   <template slot-scope="scope">
                     <el-input v-model="ruleForm.products[scope.$index].weight"></el-input>
                   </template>
                 </el-table-column>
               </el-table>-->
            </div>
            <div v-if="attr_list.length>0">
              <h2 class="form-title">产品属性</h2>
              <el-form-item v-for="item in attr_list" :key="item.id" :label="item.name">
                <el-select v-model="ruleForm.attr_id[item.id]">
                  <el-option v-for="ite in item.values" :key="ite.id" :label="ite.name"
                             :value="ite.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <div class="to_submit">
            <el-button type="primary" @click="submit('ruleForm')">确认提交</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="描述信息">
          <h3 class="ms-title">商品详情</h3>
          <!--<quillEditor class="q-edit" ref="newEditor" v-model="content"
                       style="height: 400px;" :config="editorOption"></quillEditor>-->
          <editor @getEditor="getEditor" :content="content"></editor>
        </el-tab-pane>
        <el-tab-pane label="SEO信息">
          <h3 class="ms-title">SEO信息</h3>
          <el-form :model="seo" label-width="240px" class="demo-ruleForm">
            <el-form-item
              label="页面标题">
              <el-input v-model="seo.title"></el-input>
            </el-form-item>
            <el-form-item
              label="页面关键词">
              <el-input v-model="seo.keywords"></el-input>
            </el-form-item>
            <el-form-item
              label="页面描述">
              <el-input v-model="seo.description"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="售后服务">
          <h3 class="ms-title">售后服务</h3>
          <EditorS @getEditor="getEditorS" :content="content_afterSale"></EditorS>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--// 开启规格-->
    <el-dialog title="选择规格" :visible.sync="open" width="80%">
      <h3>商品规格（点选当前商品所需规格）</h3>
      <!--  <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane v-for="(item,index) in spec_list" :key="item.id" :label="item.name" :name="item.name">
            <el-checkbox v-model="checkAll[index]" @change="handleCheckAllChange($event,index)">全选
            </el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkeds[index]" @change="handleCheckedChange($event,index)">
              <el-checkbox v-for="ite in item.value" :label="ite.id" :key="ite.id">{{ite.name}}</el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>-->
      <table class="table">
        <tr v-for="(item,index) in spec_list">
          <td class="left-td"><strong>{{item.name}}：</strong></td>
          <td>
            <label v-for="valu in item.value"><input class="checkbox_spec"
                                                     type="checkbox" :value="valu"
                                                     v-model="item.selectedValues"/>&nbsp;{{valu.name}}</label>
            <!--<label v-for="valu in item.value"><el-checkbox v-model="item.selectedValues" :label="valu">{{valu.name}}</el-checkbox></label>-->
            <!--<table class="list_table" v-if="item.Name!='发货地'&&item.selectedValues.length>0">
              <tbody>
              <tr>
                <th>{{item.name}}</th>
                &lt;!&ndash;<th>自定义名称</th>&ndash;&gt;
                <th v-if="item.Name=='颜色'">图片（无图片可以不填）</th>
              </tr>
              <tr v-for="selectedValue in item.selectedValues">
                <td>{{selectedValue.name}}</td>
                <td>
                  &lt;!&ndash;<input type="text" v-model="selectedValue.DefinitionName" maxlength="20"/>&ndash;&gt;
                </td>
                <td v-if="item.name=='颜色'">
                  <div style="float: left">
                    <input type="file" style="width: 63px;"/>
                  </div>
                  <div style="float: right">
                    <a href="" rel="link" target="_blank">
                      <img :src="selectedValue.img" width="30" height="35"/>
                    </a>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>-->
          </td>
        </tr>
        <tr>
          <td align="right"></td>
          <td class="specs-sc">
            <p class="c_a4">下表的零售价是最终展示给买家的产品价格。</p>
            <table id="skuPrice_table" class="product_list_table break-word mt_0">
              <tbody>
              <!--  <tr>
                  <td colspan="4">
                    批量设置零售价：US $<input type="text" id="batchPrice" maxlength="9"/>

                    <input type="button"
                           @click="batchSetPrice()"
                           value="确定"/> 批量设置库存：
                    <input type="text" id="batchStockQuantity" maxlength="9"/>
                    <el-input v-model="input" placeholder="请输入内容"></el-input>
                    <input type="button"
                           @click="batchSetStockQuantity()"
                           value="确定"/>
                  </td>
                </tr>-->
              <tr>
                <th>货号</th>
                <th v-for="item in spec_list" v-if="item.selectedValues.length>0">{{item.name}}</th>
                <th>库存</th>
                <th>预警线</th>
                <th>零售价</th>
                <th>市场价</th>
                <th>成本价</th>
                <th>重量</th>
              </tr>
              <tr v-for="sku in skus">
                <td class="w160">
                  <el-input v-model="sku.product_no"></el-input>
                </td>
                <td v-for="item in spec_list" v-if="item.selectedValues.length>0">{{getValueName(sku,
                  item)}}
                </td>
                <td class="w100">
                  <!--<input type="text" v-model="sku.SkuPrice" class="w50" maxlength="9"/>-->
                  <el-input v-model="sku.store_nums"></el-input>
                </td>
                <td class="w100">
                  <!--<input type="text" v-model="sku.StockQuantity" class="w50" maxlength="9"/>-->
                  <el-input v-model="sku.warning_line"></el-input>
                </td>
                <td class="w100">
                  <!--<input type="text" v-model="sku.SkuCode" class="w180" maxlength="20"/>-->
                  <el-input v-model="sku.sell_price"></el-input>
                </td>
                <td class="w100">
                  <!--<input type="text" v-model="sku.SkuCode" class="w180" maxlength="20"/>-->
                  <el-input v-model="sku.market_price"></el-input>
                </td>
                <td class="w100">
                  <!--<input type="text" v-model="sku.SkuCode" class="w180" maxlength="20"/>-->
                  <el-input v-model="sku.cost_price"></el-input>
                </td>
                <td class="w100">
                  <!--<input type="text" v-model="sku.SkuCode" class="w180" maxlength="20"/>-->
                  <el-input v-model="sku.weight"></el-input>
                </td>
              </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
      <!--<div>{{propertyResult}}</div>-->
      <!--<div>{{skusResult}}</div>-->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="generate_spec">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  import crumb from '../common/crumb.vue'
  import page from '../common/page.vue'
  import Editor from '../common/editor.vue'
  import EditorS from '../common/editorS.vue'
  import ItemUpload from '../common/upload.vue'

  function descartes(list) {
    // parent上一级索引;count指针计数
    var point = {}
    var result = []
    var pIndex = null
    var tempCount = 0
    var temp = []
    // 根据参数列生成指针对象
    for (var i in list) {
      if (typeof list[i] === 'object') {
        point[i] = {'parent': pIndex, 'count': 0}
        pIndex = i
      }
    }
    // 单维度数据结构直接返回
    if (pIndex == null) {
      return list
    }
    // 动态生成笛卡尔积
    while (true) {
      for (var index in list) {
        tempCount = point[index]['count']
        temp.push(list[index][tempCount])
      }
      // 压入结果数组
      result.push(temp)
      temp = []
      // 检查指针最大值问题
      while (true) {
        if (point[index]['count'] + 1 >= list[index].length) {
          point[index]['count'] = 0
          pIndex = point[index]['parent']
          if (pIndex == null) {
            return result
          }
          // 赋值parent进行再次检查
          index = pIndex
        } else {
          point[index]['count']++
          break
        }
      }
    }
  }

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `违规下架，当商品处于违规下架状态时，前台将不能购买该商品，只有管理员可控制商品违规下架状态，并且商品只有重新编辑后才能上架。网站系统管理员, 由总平台设置管理.点击列表里的删除按钮删除单个管理员时不受复选框的影响！复选框数据只在点击列表下方批量删除时有效。商品名称进行搜索时为关键字搜索，货号必须全名称搜索！`,

        }, // 提示模块参数
        category_id1: '', // 一级分类
        classify1: [], // 二级分类
        category_id2: '', // 二级分类
        classify2: [], // 二级分类
        search_types: [
          {label: '商品名称', value: 1},
          {label: '货号', value: 2},
          {label: '店铺名称', value: 3}
        ], // 所有类型
        search_type: null,
        search: '', // 搜索内容
        tableData: [], // 表格数据
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出管理员编辑页面
        crumb: {
          from: '商品列表',
          now: '商品编辑'
        }, // 面包屑模块参数
        level1: [], // 一级分类
        level2: [], // 二级分类
        level3: [], // 三级分类
        gt_list: [], // 产品类型
        brand_list: [], // 品牌类型
        attr_list: [], // 产品属性
        ruleForm: {
          goods_type: 0, // 商品类型
          goods_cly_1: '', // 一级分类
          goods_cly_2: '', // 二级分类
          goods_cly_3: '', // 三级分类
          product_type: '', // 产品类型
          brand_type: '', // 品牌类型
          detail: {}, // 商品信息
          products: [], // 货品信息
          attr_id: {} // 选中属性信息
        }, // 编辑页面表单数据
        // initial: false, // 用来修复编辑页面获取数据并赋值时会触发selected的change事件的问题
        open: false, // 是否开启规格
        spec_list: [], // 规格
        skus: [], // 选取的规格
        specs_key: [], // 后台所传选中规格id键值对
        fileList: [], // 图片列表
        del_pic: [], //要删除的图片数组
        dialogImageUrl: '', // 预览图片src
        dialogVisible: false, // 是否弹出图片预览
        rules: {
          'detail.name': [
            {required: true, message: '请设置商品名称', trigger: 'blur'}
          ],
          goods_cly_1: [
            {required: true, type: 'number', message: '请选择三级分类', trigger: 'blur'}
          ],
          'detail.goods_no': [
//            {validator: this.va.vaAct, message: '请设置商品编号', trigger: 'blur'},
            {required: true, message: '请设置商品编号', trigger: 'blur'},
            {min: 3, max: 18, message: '长度在 3 到 10 个字符 的字母或数字', trigger: 'blur'}
          ],

          'products[0].product_no': [
            {validator: this.va.vaAct, message: '请设置商品货号', trigger: 'blur'},
            {min: 3, max: 18, message: '长度在 3 到 10 个字符 的字母或数字', trigger: 'blur'}
          ],
          'products[0].store_nums': [
            {required: true, type: 'number', message: '请设置商品库存', trigger: 'blur'}
          ],
          'products[0].warning_line': [
            {required: true, type: 'number', message: '请设置商品库存预警线', trigger: 'blur'}
          ],
          'products[0].sell_price': [
            {required: true, type: 'number', message: '请设置商品零售价', trigger: 'blur'}
          ],
          'products[0].market_price': [
            {required: true, type: 'number', message: '请设置商品市场价', trigger: 'blur'}
          ],
          'products[0].cost_price': [
            {required: true, type: 'number', message: '请设置商品成本价', trigger: 'blur'}
          ],
          'products[0].weight': [
            {required: true, type: 'number', message: '请设置商品重量', trigger: 'blur'}
          ]
        }, // 验证规则
        imgs: [],
        is_img_up: false, // 是否上传了图片
        id: '', // 所编辑id
        shop_id: '', // 所编辑所属店铺id
        del_id: [], // 删除储存数组
        seo: {
          title: '',
          keywords: '',
          description: ''
        },
        content: '', // 商品描述信息
        content_afterSale: '', // 商品描述信息
        loading: true
      }
    },
    created() {
      this.get_goods()
    },
    mounted() {
      this.getFL(0, 0, 's')
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_goods()
      },
      // 监听子组件 编辑器内容
      getEditor(data) {
        this.content = data
      },
      // 监听子组件 编辑器内容 售后
      getEditorS(data) {
        this.content_afterSale = data
      },
      // 获取商品列表
      get_goods(search) {
        window.axiox.post(this.getApi('root/auth/goods'),
          this.dafa({
            type: 0, // 自营
            index: this.index,
            category_id: this.category_id2 ? this.category_id2 : this.category_id1,
            search_type: this.search_type,
            search_str: this.search
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.tableData = res.data.goods;
            this.totalPage = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message('对不起！请稍后再试')
        })
      },
      // 编辑商品
      edit_good(id) {
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/goods-edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info.good_id) {
                // 处理商品类型
                this.ruleForm.goods_type = res.data.info.goods_type;
                // 处理三级分类
                this.level2 = res.data.info.level2;
                this.level3 = res.data.info.level3;
                this.ruleForm.goods_cly_1 = res.data.info.level1[0].id;
                this.ruleForm.goods_cly_2 = res.data.info.level2[0].id;
                this.ruleForm.goods_cly_3 = res.data.info.level3[0].id;
                // 处理产品类型
                this.gt_list = res.data.info.gt_list;
                res.data.info.gt_list.forEach(item => {
                  if (item.selected === true
                  ) {
                    this.ruleForm.product_type = item.id
                  }
                });
                // 处理品牌
                this.brand_list = res.data.info.brand_list;
                res.data.info.brand_list.forEach(item => {
                  if (item.selected === true
                  ) {
                    this.ruleForm.brand_type = item.id
                  }
                });
                // 处理商品信息
                this.ruleForm.detail = res.data.info.detail;
                // 处理产品信息
                this.ruleForm.products = res.data.info.products;
                // 处理产品属性预选中项
                this.attr_list = res.data.info.attr_list;
                this.attr_list.forEach(item => {
                  item.values.forEach(ite => {
                    if (ite.selected === true) {
                      this.ruleForm.attr_id[item.id] = ite.id
                    }
                  })
                });
                // 处理产品规格
                this.spec_list = res.data.info.specs;
                /* this.specs_key = res.data.info.specs_key
                 for (let i in this.spec_list) {
                 res.data.info.specs_key.forEach(item => {
                 if (Object.keys(item)[0] === this.spec_list[i].id) {
                 this.checkeds[i] = item[this.spec_list[i].id]
                 }
                 })
                 } */
                // 处理商品的描述信息
                this.content = res.data.info.detail.content;
                // 商品图片
                this.fileList = res.data.info.imgs;
                // 处理seo
                this.seo.title = res.data.info.detail.seo_title;
                this.seo.keywords = res.data.info.detail.seo_keywords;
                this.seo.description = res.data.info.detail.seo_description;
                // 处理商品的描述信息
                this.content_afterSale = res.data.info.detail.after_sale;

                // 此时才开启selected的change事件请求
                this.$nextTick(() => {
                  // 开启规格数据处理
                  let arr = [];
                  /*  this.specs_key.forEach(item => {
                   item[Object.keys(item)[0]].forEach(ite => {
                   arr.push({PropertyId: Object.keys(item)[0], id: ite})
                   })
                   }) */
                  // 处理选中项的数据格式
                  this.ruleForm.products.forEach(item => {
                    item.specs.forEach(ite => {
                      ite.propertyId = ite.id;
                      arr.push({
                        PropertyId: ite.id,
                        id: ite.value.id,
                        name: ite.value.name
                        /* img: ite.value.img,
                         sort: ite.value.sort */
                      })
                    })
                  });
                  // console.log(this.ruleForm.products)
                  // 去重
                  let unique = {};
                  arr.forEach(function (gpa) {
                    unique[JSON.stringify(gpa)] = gpa
                  });
                  arr = Object.keys(unique).map(function (u) {
                    return JSON.parse(u)
                  });
                  // 将处理好的数据push到spec_list中的selectedValues数组
                  this.spec_list.forEach(item => {
                    arr.forEach(ite => {
                      if (item.id === ite.PropertyId) {
                        item.selectedValues.push(ite)
                      }
                    })
                  })
                })
                // console.log(this.spec_list)
              } else {
                this.ruleForm.products = [{
                  product_no: '',
                  store_nums: '',
                  warning_line: '',
                  sell_price: '',
                  market_price: '',
                  cost_price: '',
                  weight: ''
                }];
                this.gt_list = res.data.gt_list;
                this.ruleForm.goods_cly_1 = '';
                this.ruleForm.goods_cly_2 = '';
                this.ruleForm.goods_cly_3 = '';
                this.ruleForm.product_type = '';
                this.ruleForm.brand_type = '';
                this.ruleForm.detail = {
                  free_ship: 0,
                  point: 0,
                  exchange_point: 0,
                  sort: 1,
                  unit: '个',
                  is_online: 0,
                  is_new: 1,
                  is_hot: 1,
                  is_commend: 1
                };
                this.spec_list = [];
                this.ruleForm.attr_id = {};
                this.attr_list = [];
                this.fileList = [];
                this.initial = true;
                this.content = '<p></p>';
                this.seo = {
                  title: '',
                  keywords: '',
                  description: ''
                };
                this.content_afterSale = '<p></p>'
              }
            }
            else {
              this.$message(res.data.msg)
            }
          }).catch((err) => {
            reject(err);
            console.log(err)
          })
        })
      },
      // 获取分类
      /**
       *options
       *val 所传id
       * lv 区分分类级别
       * tp 区分不同地方的分类请求操作
       */
      getFL(val, lv, tp) {
        axiox.post(this.getApi('root/auth/get_cate'),
          `id=${val}`
        ).then(res => {
          if (res.data.code === 0) {
            switch (lv) {
              case 0:
                this.classify1 = res.data.list;
                this.level1 = res.data.list;
                break;
              case 1:
                if (tp === 's') {
                  this.classify2 = res.data.list;
                  this.category_id2 = '';
                } else {
                  this.level2 = res.data.list;
                  this.level3 = [];
                  this.ruleForm.goods_cly_2 = '';
                  this.ruleForm.goods_cly_3 = '';
                }
                break;
              case 2:
                this.level3 = res.data.list;
                this.ruleForm.goods_cly_3 = '';
            }
          } else {
            this.$message(res.data.msg)
          }
        })
      },
      // 类型改变
      change_type() {
        if (this.initial && this.ruleForm.product_type) {
          this.$notify({
            title: '警告',
            message: '类型改变！如果产品是开启过规格的必须重新编辑规格生成新的产品信息',
            type: 'warning'
          });
          window.axiox.post(this.getApi('root/auth/get_brand_attr'),
            `id=${this.ruleForm.product_type}`
          ).then(res => {
            if (res.data.code === 0) {
              this.brand_list = res.data.brand_list;
              this.ruleForm.brand_type = null;
              this.attr_list = res.data.attr_list;
              this.ruleForm.attr_id = {};
              this.spec_list = res.data.spec_list
            }
          })
        }
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
      // 删除商品
      del_good(id) {
        this.$confirm('是否确认删除商品?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/goods_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_goods();
              } else {
                this.toggleSelection();
              }
            }).catch((err) => {
              reject(err);
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
      // 开启规格
      openSpec() {
        if (this.spec_list.length > 0) {
          this.open = true
        } else {
          this.$message('此类型下暂无规格，请更换类型或前往商品类型编辑添加')
        }
      },
      // 下架商品
      down_sell(id, type) {
        let content = type === 0 ? '是否确认上架商品?' : '是否确认下架商品?';
        this.$confirm(content, '提示', {
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
            window.axiox.post(this.getApi('root/auth/goods_online'),
              this.dafa({
                type: type,
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_goods()
              } else {
                this.toggleSelection();
              }
            }).catch((err) => {
              reject(err);
              this.toggleSelection();
              this.del_id = []
            })
          })
        }).catch(() => {
          this.toggleSelection();
          this.del_id = [];
          this.$message({
            type: 'info',
            message: '已取消下架'
          })
        })
      },
      // 上传图片重写action
      // 点击预览时得到的数据
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true
      },
      // 图片上传前钩子函数
      beforeImgUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 1;
        let isType = false;
        switch (file.type) {
          case 'image/jpeg' :
            isType = true;
            break;
          case 'image/png' :
            isType = true;
            break;
          case 'image/gif' :
            isType = true;
            break;
        }

        if (!isLt2M) this.$message('请选择小于1M的图片');
        if (!isType) this.$message('不支持此图片类型');

        return isType && isLt2M
      },
      // 规格选择
      /* handleCheckAllChange (event, index) {
       if (event.target.checked) {
       let arr = []
       this.spec_list[index].value.forEach(item => {
       arr.push(item.id)
       })
       this.checkeds[index] = arr
       } else {
       this.checkeds[index] = []
       }
       //        this.checkeds[index] = event.target.checked ? this.spec_list[index].value : []
       }, */
      /*    handleCheckedChange (value, index) {
       this.checkAll[index] = value.length === this.spec_list[index].value.length
       }, */
      // 生成规格
      reBuild: function (val, oldVal) {
        let vmSkus = this.skus = []
        let propertyChecked = []
        let skuCount = 1
        let ori = []
        this.spec_list.forEach((item, index) => {
          var selectValues = item.selectedValues
          if (selectValues.length > 0
          ) {
            propertyChecked.push(index)
            skuCount = skuCount * selectValues.length
            ori.push(selectValues)
          }
        })
//        console.log(this.spec_list)
//        console.log(ori)
        var ret = descartes(ori)
//        console.log(JSON.stringify(ret))
        let no = 0;
        for (let i = 0; i < ret.length; i++) {
          let sku = {};
          if (this.id === '') {
            no++;
            sku = {
              product_no: this.ruleForm.detail.goods_no ? this.ruleForm.detail.goods_no + '_' + no : 'FN' + new Date().getTime(),
              store_nums: 999,
              warning_line: 2,
              sell_price: 0,
              market_price: 0,
              cost_price: 0,
              weight: 1
            }
          } else if (i < this.ruleForm.products.length) {
            sku = {
              product_no: this.ruleForm.products[i].product_no,
              store_nums: this.ruleForm.products[i].store_nums,
              warning_line: this.ruleForm.products[i].warning_line,
              sell_price: this.ruleForm.products[i].sell_price,
              market_price: this.ruleForm.products[i].market_price,
              cost_price: this.ruleForm.products[i].cost_price,
              weight: this.ruleForm.products[i].weight
            }
          } else {
            no++;
            sku = {
              product_no: this.ruleForm.products[0].product_no + no,
              store_nums: this.ruleForm.products[0].store_nums,
              warning_line: this.ruleForm.products[0].warning_line,
              sell_price: this.ruleForm.products[0].sell_price,
              market_price: this.ruleForm.products[0].market_price,
              cost_price: this.ruleForm.products[0].cost_price,
              weight: this.ruleForm.products[0].weight
            }
          }
          sku.specs = [];
          ret[i].forEach(item => {
            sku.specs.push({propertyId: item.PropertyId, value: {id: item.id, name: item.name}})
          });
          vmSkus.push(sku)
        }
        //        console.log(vmSkus)
        //        console.log(this.spec_list)
      },
      // 选择规格时视图显示name字段
      getValueName: function (sku, property) {
        let valueName = '';
        sku.specs.forEach(item => {
          if (item.propertyId === property.id) {
            property.selectedValues.forEach(ite => {
              if (item.value.id === ite.id) {
                valueName = ite.name;
                return false
              }
            })
          }
        });
        return valueName
      },
      // 保存规格
      generate_spec() {
        this.open = false;
        if (this.skus.length > 0) {
          this.ruleForm.products = this.skus
        } else {
          this.ruleForm.products = [{
            product_no: this.ruleForm.detail.goods_no ? this.ruleForm.detail.goods_no + '_' + 1 : 'FN' + new Date().getTime(),
            store_nums: 999,
            warning_line: 2,
            sell_price: 0,
            market_price: 0,
            cost_price: 0,
            weight: 1
          }]
        }
      },
      // 提交编辑
      submit(formName) {
        // 当未开启规格时处理products时specs不存在的情况
        let spec = this.spec_list;
        let pictures = [];
        let pic = [];
        if (this.fileList.length > 0) {
          this.fileList.forEach(item => {
            pictures.push(item['url'])
          })
        }

        pictures = pictures.concat(this.imgs);

        pictures.forEach(item => {
          if (this.del_pic.indexOf(item) === -1) {
            pic.push(item)
          }
        });

        // 表单提交
        this.$refs[formName].validate((valid) => {
            if (valid) {
              // 只需要最下级分类
              let gcId;
              if (this.ruleForm.goods_cly_3) {
                gcId = this.ruleForm.goods_cly_3
              } else if (this.ruleForm.goods_cly_2) {
                gcId = this.ruleForm.goods_cly_2
              } else {
                gcId = this.ruleForm.goods_cly_1
              }
              if (pictures.length <= 0) {
                this.$message('请上传图片');
                return false
              }

              this.antiShake.antiShake((resolve, reject) => {
                window.axiox.post(this.getApi('root/auth/goods-save'),
                  this.dafa({
                    id: this.id,
                    goods_type: this.ruleForm.goods_type,
                    type: 0, // 目前只有自营
                    gc_id: gcId, // 只取最下级分类
                    gt_id: this.ruleForm.product_type,
                    brand_id: this.ruleForm.brand_type,
                    name: this.ruleForm.detail.name,
                    subtitle: this.ruleForm.detail.subtitle,
                    keywords: this.ruleForm.detail.keywords,
                    free_ship: this.ruleForm.detail.free_ship,
                    ship_money: this.ruleForm.detail.ship_money,
                    goods_no: this.ruleForm.detail.goods_no,
                    point: this.ruleForm.detail.point,
                    exchange_point: this.ruleForm.detail.exchange_point,
                    sort: this.ruleForm.detail.sort,
                    unit: this.ruleForm.detail.unit,
                    is_online: this.ruleForm.detail.is_online,
                    is_hot: this.ruleForm.detail.is_hot,
                    is_commend: this.ruleForm.detail.is_commend,
                    is_new: this.ruleForm.detail.is_new,
                    shop_id: this.shop_id,
                    seo_title: this.seo.title,
                    seo_keywords: this.seo.keywords,
                    seo_description: this.seo.description,
                    after_sale: this.content_afterSale,
                    imgs: pic,
                    img: pic[0],
                    specs: spec || [],
                    attrs: this.ruleForm.attr_id,
                    products: this.ruleForm.products,
                    content: this.content
                  })
                ).then(res => {
                  resolve(res);
                  if (res.data.code === 0) {
                    this.add_show = false;
                    this.get_goods();
                    this.spec_list = [];
                    this.skus = [];
                    this.del_pic = [];
                  }
                }).catch(err => {
                  reject(err);
                  console.log(err);
                })
              })
            } else {
              this.$message('请填写详细信息');
              return false
            }
          }
        )
      },
      // 图片上传成功回调
      on_suc(res, file, fileList) {
        this.is_img_up = true;
        this.imgs.push(res.key)
        // this.fileList.push({'url':res.path})
      },
      //删除图片
      handleRemove(file, fileList) {
        if (file['response']) {
          this.del_pic.push(file['response']['key'])
        } else {
          this.del_pic.push(file['url'])
        }
      },
      // 图片上传时回调
      on_progress(event, file, fileList) {
      },
      // 图片上传失败回调
      on_error(err, file, fileList) {

      }
    },
    // 监视选中数据变化
    watch: {
      /* open (val) {
       if (val === true) {
       /!*   for (let i = 0, len = this.ruleForm.products.length; i < len; i++) {
       this.skus[i] = this.ruleForm.products[i]
       this.skus[i].values = []
       this.ruleForm.products[i].specs.forEach(item => {
       this.skus[i].values.push({propertyId: item.id, valueId: item.value.id})
       })
       } *!/
       let arr = []
       /!*  this.specs_key.forEach(item => {
       item[Object.keys(item)[0]].forEach(ite => {
       arr.push({PropertyId: Object.keys(item)[0], id: ite})
       })
       }) *!/
       // 处理选中项的数据格式
       this.ruleForm.products.forEach(item => {
       item.specs.forEach(ite => {
       arr.push({
       PropertyId: ite.id,
       id: ite.value.id,
       name: ite.value.name,
       img: ite.value.img,
       sort: ite.value.sort
       })
       })
       })
       // 去重
       let unique = {}
       arr.forEach(function (gpa) {
       unique[JSON.stringify(gpa)] = gpa
       })
       arr = Object.keys(unique).map(function (u) {
       return JSON.parse(u)
       })
       // 将处理好的数据push到spec_list中的selectedValues数组
       this.spec_list.forEach(item => {
       arr.forEach(ite => {
       if (item.id === ite.PropertyId) {
       item.selectedValues.push(ite)
       }
       })
       })
       }
       }, */
      'allCheckedLength': {
        handler: 'reBuild'
      },
      // 监视initial
      add_show(val) {
        if (!val) {
          this.initial = false;
          this.imgs = []
        }
      }
      /* allCheckedLength () {
       this.reBuild()
       } */
    },
    computed: {
      index() {
        return this.$store.state.index
      },
      allCheckedLength: function () {
        let length = 0;
        this.spec_list.forEach(item => {
          length += item.selectedValues.length
        });
        return length
      }
    },
    components: {
      hint, crumb, page, Editor, EditorS, ItemUpload
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .point-box {
    border-top: 1px solid #bfcbd9;
    border-left: 1px solid #bfcbd9;
    border-bottom: 1px solid #bfcbd9;
    text-align: center;
    line-height: 40px;
    margin-bottom: 44px;
  }

  .point-box > h3 {
    line-height: 40px;
    height: 40px;
    background-color: #eef1f6;
  }

  .point-box span {
    display: inline-block;
    width: 14.28%;
    border-right: 1px solid #bfcbd9;
    box-sizing: border-box;
    float: left;
  }

  .point-box > h5 {
    height: 70px;
    overflow: hidden;
  }

  .point-box > h5 span {
    padding: 15px;
  }

  .point-box .el-input {
    width: 100%;
  }

  .form-title {
    line-height: 40px;
    font-size: 16px;
    background-color: #eeeeee;
    padding: 0 20px;
    margin-bottom: 22px;
  }

  .open-specs {
    background-color: #e6e6e6;
    border: none;
    border-radius: 0;
    width: 140px;
    height: 35px;
  }

  .edit-gg .el-button {
    margin: 0 5px 20px;
    width: 100px;
  }

  .ggs .el-table {
    margin-bottom: 20px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  table th {
    background-color: #eef1f6;
  }

  table td, th {
    border: solid 1px #dfe6ec;
  }

  td {
    padding: 5px;
  }

  .table label {
    margin-left: 30px;
    float: left;
    width: 150px;
  }

  .table label input {
    margin-top: 4px
  }

  .list_table {
    clear: both;
    margin-left: 30px;
    margin-top: 10px;
  }

  .specs-sc {
    text-align: center;
  }

  .product_list_table {
    width: 100%;
  }

  .product_list_table td {
    border: none;
    padding: 10px;
  }

  .product_list_table th {
    text-align: center;
    line-height: 34px;
  }

  .left-td {
    width: 100px;
    text-align: center;
  }

  .ms-title {
    line-height: 46px;
  }

  .el-tabs {
    min-height: 100%;
  }

  .ql-container {
    min-height: 400px;
  }

  .to_submit {
    height: 60px;
    padding: 20px 0 60px;
    text-align: center;
  }

  .ggs-list {
    overflow-x: scroll;
  }

  .col_box {
    width: 1020px;
  }
</style>
