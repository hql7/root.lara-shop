<template>
  <div class="member-list prop-box">
    <!--捆绑促销-->
    <div class="m-member-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>捆绑促销列表
        <el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_seles('','')">添加活动
        </el-button>
        <div class="u-right">
          <el-select class="sele-s" v-model="status" placeholder="活动类型" :clearable="true">
            <el-option label="下架" value="0"></el-option>
            <el-option label="上架" value="1"></el-option>
          </el-select>
          <el-input placeholder="搜索活动名" v-model="search_str" class="search">
            <el-button slot="append" icon="el-icon-search" @click="get_seles"></el-button>
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
          prop="title"
          label="活动名称"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="price"
          label="套餐价格"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="status"
          label="活动类型"
          min-width="140">
          <template slot-scope="scope">
            <span v-if="tableData[scope.$index].status==1">上架</span>
            <span v-else>下架</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_seles(scope.$index, tableData)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_seles(scope.$index, tableData)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_seles('all', '')">删除
        </el-button>
      </div>
      <page :totalPage="totalPage" :currentPage="index" @toPage="to_page"></page>
    </div>
    <!--添加活动-->
    <div class="add-member prop" v-if="add_show">
      <crumb :from="crumb.from" :now="crumb.now" @goBack="go_back"></crumb>
      <el-tabs type="border-card">
        <el-tab-pane label="基本信息">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
            <el-form-item label="促销名称" prop="title">
              <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="捆绑销售价" prop="price">
              <el-input v-model.number="ruleForm.price"></el-input>
            </el-form-item>
            <el-form-item label="商品原价格" prop="cost_price">
              {{ruleForm.cost_price}}
            </el-form-item>
            <el-form-item label="是否上架" prop="status">
              <el-select v-model.number="ruleForm.status">
                <el-option label="下架" :value="0"></el-option>
                <el-option label="上架" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动描述">
              <el-input
                type="textarea"
                :rows="2"
                v-model="ruleForm.desc">
              </el-input>
            </el-form-item>
            <el-form-item label="选择商品">
              <el-button @click="choice_goods">选择商品</el-button>
            </el-form-item>
            <el-table
              :data="ruleForm.goods"
              stripe
              style="width: 100%">
              <el-table-column
                prop="good_name"
                label="商品名称"
                min-width="300">
                <template slot-scope="scope">
                  <a :href="scope.row.good_link" target="_blank">{{scope.row.good_name}}</a>
                </template>
              </el-table-column>
              <el-table-column
                prop="sell_price"
                label="价格"
                min-width="140">
              </el-table-column>
              <el-table-column
                prop="store_nums"
                label="库存"
                min-width="100">
              </el-table-column>
              <el-table-column
                label="操作"
                min-width="120">
                <template slot-scope="scope">
                  <el-button class="del-sele-good" type="danger" size="small"
                             @click="del_seles_goods(scope.$index, tableData)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>
        <div class="submit-box">
          <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
        </div>
      </el-tabs>
    </div>
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
        <el-table-column type="selection" width="55"></el-table-column>
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
        <el-button type="primary" @click="add_seles_goods">添 加</el-button>
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
          content: `优惠促销管理, 由平台设置管理。`
        }, // 提示模块参数
        tableData: [], // 表格数据
        status: '', // 活动类型  0=下架 1=上架
        search_str: '', // 搜索活动名
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出编辑页面
        crumb: {
          from: '捆绑促销列表',
          now: '编辑活动'
        }, // 面包屑模块参数
        ruleForm: {
          title: '',
          cost_price: 0.00,
          status: null,
          desc: '',
          goods: []
        }, // 编辑页面表单数据
        rules: {
          title: [
            {required: true, message: '请输入活动名称', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入促销价格'},
            {type: 'number', message: '请填写数字'}
          ],
          status: [
            {required: true, type: 'number', message: '请选择是否上架', trigger: 'blur'}
          ]
        }, // 验证规则
        dialogVisible_goods: false, // 选择参加活动的商品
        choice_goods_data: [], // 可选加入活动的商品列表
        choice_index: 1, // 可选商品当前页
        choice_pgCount: null, // 可选加入活动的商品列表总页数
        search_type: '', // 搜索类型
        search_str_: '', // 搜索关键词
        str_products_id: '', // 列表中已有的商品id拼接字符串
        multipleSelection_: [], // 参加活动商品选中列
        id: '', // 所编辑id
        del_id: [], // 删除储存数组
        loading: true
      }
    },
    created() {
      this.get_seles()
    },
    methods: {
      // 监听子组件点击事件 关闭弹出层
      go_back() {
        this.add_show = false
      },
      // 监听子分页组件 翻页
      to_page() {
        this.get_seles()
      },
      // 获取商品规格列表
      get_seles() {
        window.axiox.post(this.getApi('root/auth/bundling_list'),
          this.dafa({
            index: this.index,
            name: this.search_str,
            status: this.status
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
      // 选择活动商品
      choice_goods() {
        this.dialogVisible_goods = true;
        this.str_products_id = '';
        if (this.ruleForm.goods) {
          this.ruleForm.goods.forEach(item => {
            this.str_products_id += item.good_id + ',';
          });
        }

        this.get_seles_goods();
      },
      // 获取可参与活动商品
      get_seles_goods() {
        axiox.post(this.getApi('root/auth/bundling_goods'),
          this.dafa({
            goods_id: this.str_products_id,
            index: this.choice_index,
            search_type: this.search_type,
            search_str: this.search_str_
          })
        ).then(res => {
          if (res.data.code == 0) {
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
      edit_seles(index, rows) {
        this.id = index === '' ? '' : rows[index].id;
        window.axiox.post(this.getApi('root/auth/bundling_edit'),
          `id=${this.id}`
        ).then(res => {
          if (res.data.code === 0) {
            this.add_show = true;
            if (res.data.info) {
              this.ruleForm = res.data.info;
            } else {
              this.ruleForm = {
                title: '',
                cost_price: 0.00,
                status: null,
                desc: '',
                goods: []
              }
            }
          } else {
            this.$message(res.data.msg)
          }
        }).catch((err) => {
          console.log(err);
          this.$message('对不起！请稍后再试')
        })
      },
      // 删除此活动里的商品
      del_seles_goods(index, rows) {
        this.ruleForm.goods.splice(index, 1)
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
      // 收集参加活动商品选中列
      handleSelectionChange_(val) {
        this.multipleSelection_ = val
      },
      // 添加活动上商品
      add_seles_goods() {
        this.ruleForm.goods = this.multipleSelection_.concat(this.ruleForm.goods);
        this.ruleForm.goods.forEach(item => {
          this.ruleForm.cost_price += parseFloat(item.sell_price);
        });
        this.dialogVisible_goods = false;
      },
      // 删除活动
      del_seles(index, rows) {
        this.$confirm('是否确认将删除此活动?', '提示', {
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

          window.axiox.post(this.getApi('root/auth/bundling_del'),
            this.dafa({
              id_list: this.del_id
            })
          ).then(res => {
            if (res.data.code === 0) {
              this.get_seles();
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
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let str = '';
            if (this.ruleForm.goods) {
              this.ruleForm.goods.forEach(item => {
                str += item.good_id + ",";
              });
            }

            axiox.post(this.getApi('root/auth/bundling_save'),
              this.dafa({
                id: this.id,
                title: this.ruleForm.title,
                status: this.ruleForm.status,
                price: this.ruleForm.price,
                desc: this.ruleForm.desc,
                goods_id: str
              })
            ).then(res => {
              if (res.data.code == 0) {
                this.$message(res.data.msg);
                this.add_show = false;
                this.get_seles()
              } else {
                this.$message(res.data.msg)
              }
            }).catch(err => {
              this.$message('对不起！请稍后再试')
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

</style>
