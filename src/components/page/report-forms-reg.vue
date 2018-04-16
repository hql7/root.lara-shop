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
        <el-button slot="append" icon="el-icon-search" @click="get_area_count"></el-button>
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

  var echarts = require('echarts');

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `统计分析会员的登陆注册分布。`
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
        info: {
          legend_data: [],
          xAxis_data: [],
          series: []
        }, // 图表信息
        loading: true
      }
    },
    mounted() {
      // 加载完毕调用图形插件
      this.$nextTick(() => {
        this.get_area_count()
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
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
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
              name: '登录人数',
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '注册人数',
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
            }
          ],
          series: this.info.series
        });
      },
      get_area_count() {
        axiox.post(this.getApi('root/auth/reg_login_count'),
          this.dafa({
            start_time: this.start_time,
            end_time: this.end_time
          })
        ).then(res => {
          this.loading = false
          if (res.data.code == 0) {
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
