<template>
  <div class="member-list prop-box">
    <!--订单促销-->
    <div class="m-member-list m-prop-box">
      <hint :title="hint.title" :content="hint.content"></hint>
      <h2>订单促销列表
        <el-button type="text" icon="plus" size="small" class="add-member-btn add-btn" @click="edit_seles('')">添加活动
        </el-button>
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
          <el-select class="sele-s" v-model="type" placeholder="活动类型" :clearable="true">
            <el-option label="满额打折" value="0"></el-option>
            <el-option label="满额优惠金额" value="1"></el-option>
            <el-option label="满额送倍数积分" value="2"></el-option>
            <el-option label="满额免运费" value="4"></el-option>
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
          prop="name"
          label="活动名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="type"
          label="活动类型"
          min-width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.type==0">满额打折</span>
            <span v-else-if="scope.row.type==1">满额优惠金额</span>
            <span v-else-if="scope.row.type==2">满额送倍数积分</span>
            <!--<span v-else-if="tableData[scope.$index].type==3">满额送代金券</span>-->
            <span v-else-if="scope.row.type==4">满额免运费</span>
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
        <el-form-item label="活动名称" prop="prom_name">
          <el-input v-model="ruleForm.prom_name"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-select v-model.number="ruleForm.type">
            <el-option label="满额打折" :value="0"></el-option>
            <el-option label="满额优惠金额" :value="1"></el-option>
            <el-option label="满额送倍数积分" :value="2"></el-option>
            <!--<el-option label="满额送代金券" :value="3"></el-option>-->
            <el-option label="满额免运费" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需满足金额" prop="money">
          <el-input v-model.number="ruleForm.money"></el-input>
        </el-form-item>
        <el-form-item label="折扣" v-if="ruleForm.type==0" prop="expression">
          <el-input v-model="ruleForm.expression"></el-input>
          <em class="c-danger"> % 折扣值(1-100 如果打9折，请输入90)</em>
        </el-form-item>
        <el-form-item label="优惠金额" v-if="ruleForm.type==1" prop="expression">
          <el-input v-model="ruleForm.expression"></el-input>
          <em class="c-danger">立减金额（元）</em>
        </el-form-item>
        <el-form-item label="倍数" v-if="ruleForm.type==2" prop="expression">
          <el-input v-model="ruleForm.expression"></el-input>
          <em class="c-danger">商品送积分的倍数!</em>
        </el-form-item>
        <el-form-item label="活动开始时间" prop="start_time">
          <el-date-picker
            v-model="ruleForm.start_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="STIME"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间" prop="end_time">
          <el-date-picker
            v-model="ruleForm.end_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="ETIME"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input
            type="textarea"
            :rows="2"
            v-model="ruleForm.desc">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
        </el-form-item>
      </el-form>
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
        type: '', // 活动类型  0=满额打折 1=满额优惠金额 2=满额送倍数积分 3=满额送代金券 4=满额免运费
        search_str: '', // 搜索活动名
        multipleSelection: [], // 选中列
        totalPage: 1, // 总页
        add_show: false, // 是否弹出编辑页面
        crumb: {
          from: '订单促销列表',
          now: '编辑活动'
        }, // 面包屑模块参数
        ruleForm: {
          prom_name: '',
          type: 0,
          money: null,
          expression: '',
          start_time: '',
          end_time: '',
          desc: '',

        }, // 编辑页面表单数据
        rules: {
          prom_name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'}
          ],
          type: [
            {required: true, type: 'number', message: '请选择活动类型', trigger: 'blur'}
          ],
          money: [
            {required: true, type: 'number', message: '请输入正确金额', trigger: 'blur'}
          ],
          start_time: [
//            {required: true, type: 'date', message: '请选择开始时间', trigger: 'blur'}
          ],
          end_time: [
//            {required: true, type: 'date', message: '请选择结束时间', trigger: 'blur'}
          ]
        }, // 验证规则
        dialogVisible: false, // 是否弹出
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
        window.axiox.post(this.getApi('root/auth/prom_order_list'),
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
      // 时间格式
      STIME(val) {
        this.ruleForm.start_time = val;
      },
      ETIME(val) {
        this.ruleForm.end_time = val;
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
          window.axiox.post(this.getApi('root/auth/prom_order_edit'),
            `id=${this.id}`
          ).then(res => {
            resolve(res);
            if (res.data.code === 0) {
              this.add_show = true;
              if (res.data.info) {
                this.ruleForm = res.data.info;
              } else {
                this.ruleForm = {
                  prom_name: '',
                  type: 0,
                  money: null,
                  expression: '',
                  start_time: '',
                  end_time: '',
                  desc: '',

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
            this.del_id.push(rows[index].id)
          }

          this.antiShake.antiShake((resolve, reject) => {
            window.axiox.post(this.getApi('root/auth/prom_order_del'),
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
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.antiShake.antiShake((resolve, reject) => {
              axiox.post(this.getApi('root/auth/prom_order_save'),
                this.dafa({
                  id: this.id,
                  prom_name: this.ruleForm.prom_name,
                  type: this.ruleForm.type,
                  money: this.ruleForm.money,
                  expression: this.ruleForm.expression,
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
