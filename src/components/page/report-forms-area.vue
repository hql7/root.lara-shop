<template>
  <div class="report-forms-order">
    <hint :title="hint.title" :content="hint.content"></hint>
    <h2>
      <div class="u-right">
        <el-date-picker
          v-model="date_time"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          placeholder="选择日期范围"
          @change="choice_time"
          :picker-options="pickerOptions">
        </el-date-picker>
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
  </div>
</template>

<script>
  import hint from '../common/hint.vue'
  // var echarts = require('echarts');
  import echarts from 'echarts'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `统计分析历史订单交易数, 订单金额。下面数据为当天全部数据，点击左侧订单名称，查看单个订单状态`
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
//        type: '', // 类型 0=系统统计 1=商家统计
        data: [],
        series: [],
        info: {
          legend_data: [],
          series: []
        }, // 图表信息
        loading: true
      }
    },
    mounted() {
      // 加载完毕调用图形插件
      this.$nextTick(() => {
        this.get_map();
        this.get_order_count();
      })
    },
    methods: {
      set_echarts() {
        let myChart = echarts.init(document.getElementById('echCan'));
        let option = {
          title: {
            text: '订单地区分布',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: []
          },
          visualMap: {
            left: 'left',
            top: 'bottom',
            calculable: true
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          series: []
        };
        myChart.setOption(option);
        myChart.setOption({
          legend: {
            data: this.data
          },
          series: this.series
        });
      },
      get_order_count() {
        axiox.post(this.getApi('root/auth/area_count'),
          this.dafa({
//            type: this.type,
            start_time: this.start_time,
            end_time: this.end_time
          })
        ).then(res => {
          this.loading = false
          if (res.data.code === 0) {
            this.data = res.data.info.legend_data;
            this.series = res.data.info.series;
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
      // 加载地图
      get_map() {
        axiox.get('../../../static/map/china.json').then(data => {
          echarts.registerMap('china', data.data);
          let chart = echarts.init(document.getElementById('echCan'));
          chart.setOption({
            series: [{
              type: 'map',
              map: 'china'
            }]
          });
        })
      },
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
