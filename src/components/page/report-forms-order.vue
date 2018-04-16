<template>
  <div class="report-forms-order">
    <hint :title="hint.title" :content="hint.content"></hint>
    <h2>
      <div class="u-right">
        <el-date-picker
          v-model="date_time"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="choice_time"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-select class="sele-s" v-model="type" placeholder="类型" :clearable="true">
          <el-option label="系统统计" value="0"></el-option>
          <el-option label="商家统计" value="1"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="get_order_count"></el-button>
      </div>
    </h2>
    <!--图形区-->
    <div
      v-loading="loading"
      element-loading-text="拼命加载中"
      class="echarts">
      <div id="echCan"></div>
    </div>
    <!--<el-table
      :data="tableData"
      ref="multipleTable"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
    <div class="select-all" v-if="tableData.length>0">
      <el-button :plain="true" type="primary" @click="toggleSelection()">取消</el-button>
      <el-button :plain="true" :disabled="multipleSelection.length==0" type="danger"
                 @click="del_report('all', '')">删除
      </el-button>
    </div>-->
  </div>
</template>

<script>
  import hint from '../common/hint.vue'

  var echarts = require('echarts');

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `统计分析历史订单交易数, 订单金额。如果不进行搜索下面数据为当天统计数据`
        }, // 提示模块参数
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
        type: '', // 类型 0=系统统计 1=商家统计
        info: {}, // 图表信息
        loading: true
        /*   tableData: [],
         multipleSelection: [], // 选中列*/
      }
    },
    mounted() {
      // 加载完毕调用图形插件
      this.$nextTick(() => {
        this.get_order_count()
      })
    },
    methods: {
      set_echarts() {
        let myChart = echarts.init(document.getElementById('echCan'));
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
//          toolbox: {
//            feature: {
//              dataView: {show: true, readOnly: false},
//              magicType: {show: true, type: ['line', 'bar']},
//              restore: {show: true},
//              saveAsImage: {show: true}
//            }
//          },
          legend: {
            data: []
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '交易金额',
              axisLabel: {
                formatter: '{value}￥'
              }
            },
            {
              type: 'value',
              name: '订单数',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: []
        };
        myChart.setOption(option);
        myChart.setOption({
          legend: {
            data: this.info.legend_data
          },
          xAxis: [
            {
              data: this.info.xAxis_data
            },
          ],
          series: this.info.series
        });
      },
      get_order_count() {
        axiox.post(this.getApi('root/auth/order_count'),
          this.dafa({
            type: this.type,
            start_time: this.start_time,
            end_time: this.end_time
          })
        ).then(res => {
          this.loading = false
          if (res.data.code === 0) {
            this.info = res.data.info;
            this.set_echarts()
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.loading = false
          console.log(err);
          this.$message('对不起！请稍后再试')
        })
      },
      // 选择时间处理数据格式
      choice_time(val) {
        // let start = Date.parse(new Date(val.substr(0, 10)));
        // let end = Date.parse(new Date(val.substr(13, 10)));
        let start = Date.parse(new Date(val[0]));
        let end = Date.parse(new Date(val[1]));
        this.start_time = start / 1000;
        this.end_time = end / 1000;
      }
      /*  // 取消选择
       toggleSelection (rows) {
       if (rows) {
       rows.forEach(row => {
       this.$refs.multipleTable.toggleRowSelection(row)
       })
       } else {
       this.$refs.multipleTable.clearSelection()
       }
       },
       // 收集选中列
       handleSelectionChange (val) {
       this.multipleSelection = val
       },
       del_report (index) {
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
       this.del_id.push(this.id)
       }

       window.axiox.post(this.getApi('root/auth/prom_goods_del'),
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
       }*/
    },
    components: {hint}
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*图表区*/
  .echarts {
    height: 515px;
    background-color: #fff;
  }

  .echarts-title {
    height: 60px;
  }

  #echCan {
    height: 455px;
  }

  .report-forms-order > h2 {
    overflow: hidden;
  }

  .echarts {
    margin: 70px 0;
  }
</style>
