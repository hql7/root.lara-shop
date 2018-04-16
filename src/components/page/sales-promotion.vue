<template>
  <div class="member-list prop-box">
    <!--商品促销-->
    <div class="m-member-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>促销活动列表
        <el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_seles('')">添加活动
        </el-button>
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
          <el-select class="sele-s" v-model="type" placeholder="活动类型" :clearable="true">
            <el-option label="直接打折" value="0"></el-option>
            <el-option label="减价优惠" value="1"></el-option>
            <el-option label="固定金额出售" value="2"></el-option>
            <el-option label="买就赠代金券" value="3"></el-option>
            <el-option label="买M件送N件" value="4"></el-option>
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
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-dropdown @command="handle($event,scope.row.id)">
              <el-button type="primary" size="small">
                处理<i class="el-icon-setting el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="i-box">
                <el-dropdown-item command="0"><i class="iconfont icon-chakangengduoshangpin c-danger"></i>&nbsp;查看商品
                </el-dropdown-item>
                <el-dropdown-item command="1"><i class="iconfont icon-wancheng1 c-danger"></i>编辑</el-dropdown-item>
                <el-dropdown-item command="2"><i class="iconfont icon-shanchu4 c-danger"></i>&nbsp;删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="活动名称"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="type"
          label="活动类型"
          min-width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">减价优惠</span>
            <span v-else-if="scope.row.type==2">固定金额出售</span>
            <span v-else-if="scope.row.type==3">买就赠代金券</span>
            <span v-else-if="scope.row.type==4">买M件送N件</span>
            <span v-else>直接打折</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="开始时间"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="结束时间"
          min-width="160">
        </el-table-column>
      </el-table>
      <div class="select-all" v-if="tableData.length>0">
        <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
        <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                   @click="del_seles('all')">删除
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
            <el-form-item label="活动名称" prop="prom_name">
              <el-input v-model="ruleForm.prom_name"></el-input>
            </el-form-item>
            <el-form-item label="活动类型" prop="type">
              <el-select v-model.number="ruleForm.type">
                <el-option label="直接打折" :value="0"></el-option>
                <el-option label="减价优惠" :value="1"></el-option>
                <el-option label="固定金额出售" :value="2"></el-option>
                <!--<el-option label="买就赠代金券" :value="3"></el-option>-->
                <el-option label="买M件送N件" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="折扣" prop="expression" v-if="ruleForm.type==0">
              <el-input v-model="ruleForm.expression"></el-input>
              <em class="c-danger">% 折扣值(1-100 如果打9折，请输入90)</em>
            </el-form-item>
            <el-form-item label="立减金额" prop="expression" v-else-if="ruleForm.type==1">
              <el-input v-model="ruleForm.expression"></el-input>
              <em class="c-danger">立减金额（元）</em>
            </el-form-item>
            <el-form-item label="固定金额出售" prop="expression" v-else-if="ruleForm.type==2">
              <el-input v-model="ruleForm.expression"></el-input>
              <em class="c-danger">出售金额（元）</em>
            </el-form-item>
            <el-form-item label="买M件送N件" prop="expression" v-else-if="ruleForm.type==4">
              <el-input v-model="ruleForm.expression"></el-input>
              <em class="c-danger">买几件送几件（如买3件送1件: 3/1）</em>
            </el-form-item>
            <el-form-item label="活动描述">
              <el-input type="textarea" :rows="2" v-model="ruleForm.description"></el-input>
            </el-form-item>
            <el-form-item label="活动开始时间" prop="start_time">
              <el-date-picker
                v-model="ruleForm.start_time"
                @change="STIME"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="活动结束时间" prop="end_time">
              <el-date-picker
                v-model="ruleForm.end_time"
                @change="ETIME"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="选择商品">
              <el-button @click="choice_goods">选择商品</el-button>
              <em class="c-danger">任何商品只能参加一种活动</em>
            </el-form-item>
            <el-table
              :data="ruleForm.products"
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
                             @click="del_seles_goods(scope.row.id)">
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
    <!--操作-->
    <el-dialog
      title="查看商品"
      :visible.sync="dialogVisible"
      width="80%">
      <el-table :data="see_goods_data">
        <el-table-column property="good_name" label="商品名称" min-width="260">
          <template slot-scope="scope">
            <a :href="scope.row.good_link" target="_blank">{{scope.row.good_name}}</a>
          </template>
        </el-table-column>
        <!--<el-table-column property="good_link" label="商品链接" min-width="220">-->
        <!--<template slot-scope="scope">-->
        <!--<a :href="scope.row.good_link">{{scope.row.good_link}}</a>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column property="specs_str" label="规格" min-width="160"></el-table-column>-->
        <el-table-column property="sell_price" label="价格" min-width="100"></el-table-column>
        <el-table-column property="store_nums" label="库存" min-width="100"></el-table-column>
      </el-table>
      <div class="see-goods-fy">
        <el-pagination
          @current-change="next_see_goods"
          :current-page="see_index"
          layout="total, prev, pager, next, jumper"
          :page-count="see_pgCount">
        </el-pagination>
      </div>
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
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="good_name" label="商品名称" min-width="260">
          <template slot-scope="scope">
            <a :href="scope.row.good_link" target="_blank">{{scope.row.good_name}}</a>
          </template>
        </el-table-column>
        <!--<el-table-column property="good_link" label="商品链接" min-width="220"></el-table-column>-->
        <!--<el-table-column property="specs_str" label="规格" min-width="160"></el-table-column>-->
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
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }, // 时间范围选择
        date_time: '', // 所选时间
        start_time: '', // 起始时间
        end_time: '', // 截止时间
        type: '', // 活动类型  0=直接打折 1=减价优惠 2=固定金额出售 3=买就赠代金券 4=买M件送N件
        search_str: '', // 搜索活动名
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出编辑页面
        crumb: {
          from: '促销活动列表',
          now: '编辑活动'
        }, // 面包屑模块参数
        ruleForm: {
          prom_name: '',
          type: 0,
          expression: '',
          start_time: '',
          end_time: '',
          products: []
        }, // 编辑页面表单数据
        rules: {
          prom_name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'}
          ],
          type: [
            {required: true, type: 'number', message: '请选择活动类型', trigger: 'blur'}
          ],
          start_time: [
//            {required: true, type: 'date', message: '请选择开始时间', trigger: 'blur'}
          ],
          end_time: [
//            {required: true, type: 'date', message: '请选择结束时间', trigger: 'blur'}
          ]
        }, // 验证规则
        dialogVisible: false, // 是否弹出
        see_index: 1, // 查看商品当前页
        see_pgCount: null, // 查看商品总页数
        see_goods_data: [], // 查看商品表格
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
      // 获取商品促销列表
      get_seles() {
        window.axiox.post(this.getApi('root/auth/prom_goods_list'),
          this.dafa({
            index: this.index,
            name: this.search_str,
            start_time: this.start_time,
            end_time: this.end_time,
            type: this.type
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
      // 操作
      handle(val, id) {
        this.id = id;
        switch (val) {
          case '0':
            this.dialogVisible = true;
            this.see_goods(id);
            break;
          case '1':
            this.edit_seles(id);
            break;
          case '2':
            this.del_seles(id);
            break
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
              if (res.data.code === 0) {
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
            break
        }
      },
      // 查看商品
      see_goods(sales_id) {
        axiox.post(this.getApi('root/auth/prom_goods_view'),
          this.dafa({
            id: sales_id,
            index: this.see_index
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.see_goods_data = res.data.list;
            this.see_pgCount = res.data.fy_pgCount
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.$message('对不起！请稍后再试')
        })
      },
      // 查看商品翻页
      next_see_goods(val) {
        this.see_index = val;
        this.see_goods()
      },
      // 选择活动商品
      choice_goods() {
        this.dialogVisible_goods = true;
        this.ruleForm.products.forEach(item => {
          this.str_products_id += item.product_id + ','
        });
        this.get_seles_goods()
      },
      // 获取可参与活动商品
      get_seles_goods() {
        axiox.post(this.getApi('root/auth/can_prom_goods'),
          this.dafa({
            products_id: this.str_products_id,
            id: this.id,
            index: this.choice_index,
            search_type: this.search_type,
            search_str: this.search_str_
          })
        ).then(res => {
          if (res.data.code === 0) {
            this.choice_pgCount = res.data.fy_pgCount;
            if (res.data.list) {
              this.choice_goods_data = res.data.list
            }
          }
        })
      },
      // 选择商品翻页
      next_choice_goods(val) {
        this.choice_index = val;
        this.get_seles_goods()
      },
      // 选择时间处理数据格式
      choice_time(val) {
        // let start = Date.parse(new Date(val.substr(0, 19)))
        // let end = Date.parse(new Date(val.substr(22, 19)))
        let start = Date.parse(new Date(val[0]))
        let end = Date.parse(new Date(val[1]))
        this.start_time = start / 1000
        this.end_time = end / 1000
      },
      // 编辑活动
      edit_seles(sales_id) {
        this.id = sales_id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/prom_goods_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info) {
                this.ruleForm = res.data.info
              } else {
                this.ruleForm = {
                  prom_name: '',
                  type: 0,
                  expression: '',
                  start_time: '',
                  end_time: '',
                  products: []
                }
              }
            }
          }).catch((err) => {
            reject(err);
            console.log(err);
          })
        })
      },
      // 删除此活动里的商品
      del_seles_goods(index, rows) {
        this.ruleForm.products.splice(index, 1)
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
        this.ruleForm.products = this.multipleSelection_.concat(this.ruleForm.products)
        this.dialogVisible_goods = false
      },
      // 删除活动
      del_seles(id) {
        this.$confirm('是否确认将删除此活动?', '提示', {
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
            window.axiox.post(this.getApi('root/auth/prom_goods_del'),
              this.dafa({
                id_list: this.del_id
              })
            ).then(res => {
              resolve(res);
              this.del_id = [];
              if (res.data.code === 0) {
                this.get_seles();
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
      // 时间格式
      STIME(val) {
        this.ruleForm.start_time = val
      },
      ETIME(val) {
        this.ruleForm.end_time = val
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let str = '';
            this.ruleForm.products.forEach(item => {
              str += item.product_id + ','
            });
            this.antiShake.antiShake((resolve, reject) => {
              axiox.post(this.getApi('root/auth/prom_goods_save'),
                this.dafa({
                  id: this.id,
                  prom_name: this.ruleForm.prom_name,
                  type: this.ruleForm.type,
                  expression: this.ruleForm.expression,
                  start_time: !this.ruleForm.start_time ? '' : this.ruleForm.start_time,
                  end_time: !this.ruleForm.end_time ? '' : this.ruleForm.end_time,
                  products: str,
                  description: this.ruleForm.description
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_seles()
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
