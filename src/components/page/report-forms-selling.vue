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
          <el-option label="系统热销排行" value="0"></el-option>
          <el-option label="商家热销排行" value="1"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="get_hot_count"></el-button>
      </div>
    </h2>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="tableData"
      ref="multipleTable"
      stripe
      style="width: 100%">
      <el-table-column
        prop="top"
        label="排行"
        min-width="60">
      </el-table-column>
      <el-table-column
        prop="good_name"
        label="商品名称"
        min-width="280">
        <template slot-scope="scope">
          <a :href="scope.row.good_link" target="_blank">{{scope.row.good_name}}</a>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="good_link"-->
      <!--label="商品链接"-->
      <!--min-width="160">-->
      <!--<template slot-scope="scope">-->
      <!--<a :href="scope.row.good_link">{{scope.row.good_link}}</a>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="good_no"
        label="货号"
        min-width="160">
      </el-table-column>
      <el-table-column
        prop="sale_nums"
        label="销量"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="sale_money"
        label="销售额"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="ave_price"
        label="均价"
        min-width="120">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import hint from '../common/hint.vue'

  export default {
    data() {
      return {
        hint: {
          title: '操作提示',
          content: `热销统计的展示数量可以通过更改 show_num 的数值来改变。如果不进行搜索下面数据为当天统计数据`
        }, // 提示模块参数
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
        type: '', // 类型 0=系统热销排行  1=商家热销排行
        show_num: 20, // 展示条数
        tableData: [],
        loading: true
      }
    },
    created() {
      this.get_hot_count()
    },
    methods: {
      get_hot_count() {
        axiox.post(this.getApi('root/auth/hot_count'),
          this.dafa({
            type: this.type,
            show_num: this.show_num,
            start_time: this.start_time,
            end_time: this.end_time
          })
        ).then(res => {
          this.loading = false
          if (res.data.code === 0) {
            this.tableData = res.data.list
          } else {
            this.$message(res.data.msg)
          }
        }).catch(err => {
          this.loading = false
//          console.log(err);
          this.$message('对不起！请稍后再试')
        })
      },
      // 选择时间处理数据格式
      choice_time(val) {
        // let start = Date.parse(new Date(val.substr(0, 10)))
        // let end = Date.parse(new Date(val.substr(13, 10)))
        let start = Date.parse(new Date(val[0]))
        let end = Date.parse(new Date(val[1]))
        this.start_time = start / 1000
        this.end_time = end / 1000
      }
    },
    components: {hint}
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*图表区*/
  .report-forms-order > h2 {
    overflow: hidden;
    margin-bottom: 15px;
  }

</style>
