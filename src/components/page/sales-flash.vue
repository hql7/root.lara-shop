<template>
  <div class="member-list prop-box">
    <!--限时抢购-->
    <div class="m-member-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>限时抢购列表
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
          <el-select class="sele-s" v-model="is_end" placeholder="状态" :clearable="true">
            <el-option label="进行中" value="0"></el-option>
            <el-option label="已结束" value="1"></el-option>
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
          min-width="240">
        </el-table-column>
        <el-table-column
          prop="max_num"
          label="限购总量"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="goods_num"
          label="商品数量"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="order_num"
          label="订单数量"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="price"
          label="抢购价格"
          min-width="140">
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
        <el-table-column
          prop="is_end"
          label="状态"
          min-width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.is_end==1">已结束</span>
            <span v-else>进行中</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="edit" @click="edit_seles(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="delete" @click="del_seles(scope.row.id)">删除
            </el-button>
          </template>
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
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px">
        <el-form-item label="抢购名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="good_name">
          <el-input v-model="ruleForm.good_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="允许抢购的最大数量" prop="max_num">
          <el-input v-model.number="ruleForm.max_num"></el-input>
        </el-form-item>
        <el-form-item label="每个人能购买的数量" prop="quota_num">
          <el-input v-model.number="ruleForm.quota_num"></el-input>
        </el-form-item>
        <el-form-item label="抢购价格" prop="price">
          <el-input v-model.number="ruleForm.price"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            v-model="ruleForm.start_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="STIME"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="ruleForm.end_time"
            @change="ETIME"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动描述" prop="desc">
          <el-input
            type="textarea"
            :rows="2"
            v-model="ruleForm.desc">
          </el-input>
        </el-form-item>
        <el-form-item label="选择商品">
          <el-button @click="get_seles_goods">选择商品</el-button>
          <em class="c-danger">任何商品只能参加一种活动</em>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--操作-->
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
      <el-table :data="choice_goods_data">
        <el-table-column label="选择" width="80">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio" :label="choice_goods_data[scope.$index].good_id"></el-radio>
          </template>
        </el-table-column>
        <el-table-column property="good_name" label="商品名称" min-width="260">
          <template slot-scope="scope">
            <a :href="scope.row.good_link" target="_blank">{{scope.row.good_name}}</a>
          </template>
        </el-table-column>
        <!--<el-table-column property="good_link" label="商品链接" min-width="220"></el-table-column>-->
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
          content: `优惠促销管理, 由平台设置管理。`
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
        is_end: '', // 状态  0=进行中 1=已结束
        search_str: '', // 搜索活动名
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出编辑页面
        crumb: {
          from: '限时抢购列表',
          now: '编辑活动'
        }, // 面包屑模块参数
        ruleForm: {
          title: '',
          good_id: null,
          good_name: '',
          max_num: null,
          quota_num: null,
          price: null,
          start_time: '',
          end_time: '',
          desc: '',
        }, // 编辑页面表单数据
        rules: {
          title: [
            {required: true, message: '请输入活动名称', trigger: 'blur'}
          ],
          good_name: [
            {required: true, message: '请选择商品', trigger: 'blur'}
          ],
          max_num: [
            {required: true, type: 'number', message: '允许抢购的最大数量', trigger: 'blur'}
          ],
          quota_num: [
            {required: true, type: 'number', message: '每个人能购买的数量', trigger: 'blur'}
          ],
          price: [
            {required: true, type: 'number', message: '请输入团购价格', trigger: 'blur'}
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
        good_id: '', // 目前在抢商品id
        radio: null,
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
      // 获取限时抢购列表
      get_seles() {
        window.axiox.post(this.getApi('root/auth/flash_sale_list'),
          this.dafa({
            index: this.index,
            start_time: this.start_time,
            end_time: this.end_time,
            title: this.search_str,
            is_end: this.is_end
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
      // 获取可参与活动商品
      get_seles_goods() {
        this.dialogVisible_goods = true;
        axiox.post(this.getApi('root/auth/flash_sale_goods'),
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
      // 选择时间处理数据格式
      choice_time(val) {
        // let start = Date.parse(new Date(val.substr(0, 19)));
        // let end = Date.parse(new Date(val.substr(22, 19)));
        let start = Date.parse(new Date(val[0]));
        let end = Date.parse(new Date(val[1]));
        this.start_time = start / 1000;
        this.end_time = end / 1000;
      },
      // 编辑活动
      edit_seles(id) {
        this.id = id;
        this.antiShake.antiShake((resolve, reject) => {
          window.axiox.post(this.getApi('root/auth/flash_sale_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info) {
                this.ruleForm = res.data.info;
                this.good_id = res.data.info.good_id
              } else {
                this.ruleForm = {
                  title: '',
                  good_id: null,
                  good_name: '',
                  max_num: null,
                  quota_num: null,
                  price: null,
                  start_time: '',
                  end_time: '',
                  desc: '',
                }
              }
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
      // 选择团购商品
      add_seles_goods() {
        this.choice_goods_data.forEach(item => {
          if (item.good_id == this.radio) {
            this.ruleForm.good_id = this.radio;
            this.ruleForm.good_name = item.good_name;
          }
        });
        this.dialogVisible_goods = false;
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
            this.del_id.push(id)
          }

          this.antiShake.antiShake((resolve, reject) => {
            window.axiox.post(this.getApi('root/auth/flash_sale_del'),
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
              // this.$message('对不起！请稍后再试');
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
        this.ruleForm.start_time = val;
      },
      ETIME(val) {
        this.ruleForm.end_time = val;
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              axiox.post(this.getApi('root/auth/flash_sale_save'),
                this.dafa({
                  id: this.id,
                  title: this.ruleForm.title,
                  good_id: this.ruleForm.good_id,
                  max_num: this.ruleForm.max_num,
                  quota_num: this.ruleForm.quota_num,
                  price: this.ruleForm.price,
                  start_time: this.ruleForm.start_time,
                  end_time: this.ruleForm.end_time,
                  desc: this.ruleForm.desc
                })
              ).then(res => {
                resolve(res);
                if (res.data.code === 0) {
                  this.add_show = false;
                  this.get_seles()
                }
              }).catch(err => {
                reject(err);
                // this.$message('对不起！请稍后再试')
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
