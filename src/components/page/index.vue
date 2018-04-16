<template>
  <div class="index">
    <div class="module">
      <!--上部模块1-->
      <div class="module-1">
        <p class="border-h"></p>
        <router-link to="/order-list" tag="div" class="_ff6511 m1-item">
          <p>{{module1.month_order}}</p>
          <h3>月新增订单</h3>
        </router-link>
        <router-link to="/order-list" tag="div" class="_06b651 m1-item">
          <p>{{module1.day_order}}</p>
          <h3>日新增订单</h3>
        </router-link>
        <router-link to="/member-list" tag="div" class="_ae11ff m1-item">
          <p>{{module1.month_user}}</p>
          <h3>月新增会员</h3>
        </router-link>
        <router-link to="/member-list" tag="div" class="_ff1111 m1-item">
          <p>{{module1.day_user}}</p>
          <h3>日新增会员</h3>
        </router-link>
        <p class="border-s"></p>
      </div>
      <!--上部模块2-->
      <div class="module-2">
        <div class="m2-item">
          <!--<span class="i-box"><i class="iconfont icon-purse"></i> Rading volume</span>-->
          <p>{{module2.sum_money}}</p>
          <h3>总交易额</h3>
        </div>
        <div class="m2-item">
          <!--<i class="iconfont icon-purse"></i>-->
          <p>{{module2.month_money}}</p>
          <h3>月交易额</h3>
        </div>
        <div class="m2-item">
          <!--<i class="iconfont icon-purse"></i>-->
          <p>{{module2.day_money}}</p>
          <h3>日交易额</h3>
        </div>
        <div class="m2-item">
          <!--<i class="iconfont icon-purse"></i>-->
          <p>{{module2.pc_money}}</p>
          <h3>PC交易额</h3>
        </div>
        <div class="m2-item">
          <!--<i class="iconfont icon-purse"></i>-->
          <p>{{module2.app_money}}</p>
          <h3>APP交易额</h3>
        </div>
        <div class="m2-item">
          <!--<i class="iconfont icon-purse"></i>-->
          <p>{{module2.wx_money}}</p>
          <h3>小程序交易额</h3>
        </div>
      </div>
      <!--上部模块3-->
      <div class="module-3">
        <h2 class="m3-tit"><span>重要信息提示</span></h2>
        <ul class="m3-ul">
          <router-link to="/order-list" tag="li" class="m3-item">
            <span>待处理订单</span><i>{{module3.pending}}</i>
          </router-link>
          <router-link to="/order-refund" tag="li" class="m3-item">
            <span>待退款订单</span><i>{{module3.return_money}}</i>
          </router-link>
          <router-link to="/order-return" tag="li" class="m3-item">
            <span>待退换订单</span><i>{{module3.sales_return}}</i>
          </router-link>
          <li class="m3-item">
            <span>进行中优惠活动</span><i>{{module3.discounts}}</i>
          </li>
          <li class="m3-item">
            <span>将到期优惠活动</span><i>{{module3.end_discounts}}</i>
          </li>
          <router-link to="/goods-list" tag="li" class="m3-item">
            <span>在售商品数</span><i>{{module3.audit_goods}}</i>
          </router-link>
        </ul>
      </div>
    </div>
    <!--图形区-->
    <div class="echarts">
      <div class="echarts-title"></div>
      <div id="echCan"></div>
    </div>
  </div>
</template>

<script>
  var echarts = require('echarts')

  export default {
    data() {
      return {
        module1: {}, // 订单信息
        module2: {}, // 店铺 商品信息
        module3: {} // 待处理信息
      }
    },
    created() {
      this.getMoudleData();
    },
    mounted() {
//      this.$store.commit('newLevel', '8', '8-1', '8-1-1')
      // 加载完毕调用图形插件
      this.$nextTick(() => {
        this.set_echarts()
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
              label: {
                backgroundColor: '#283b56'
              }
            }
          },
          legend: {
            data: ['交易金额', '订单数']
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          dataZoom: {
            show: false,
            start: 0,
            end: 100
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: true,
              data: (function () {
                var now = new Date()
                var res = []
                var len = 10
                while (len--) {
                  res.unshift(now.toLocaleTimeString().replace(/^\D*!/, ''))
                  now = new Date(now - 2000)
                }
                return res
              })()
            },
            {
              type: 'category',
              boundaryGap: true,
              data: (function () {
                var res = []
                var len = 10
                while (len--) {
                  res.push(len + 1)
                }
                return res
              })()
            }
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              name: '金额',
              max: 30,
              min: 0,
              boundaryGap: [0.2, 0.2]
            },
            {
              type: 'value',
              scale: true,
              name: '订单数',
              max: 1200,
              min: 0,
              boundaryGap: [0.2, 0.2]
            }
          ],
          series: [
            {
              name: '订单数',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: (function () {
                var res = []
                var len = 10
                while (len--) {
                  res.push(Math.round(Math.random() * 1000))
                }
                return res
              })()
            },
            {
              name: '交易金额',
              type: 'line',
              data: (function () {
                var res = []
                var len = 0
                while (len < 10) {
                  res.push((Math.random() * 10 + 5).toFixed(1) - 0)
                  len++
                }
                return res
              })()
            }
          ]
        }
        var count = 11
        setInterval(function () {
          let axisData = (new Date()).toLocaleTimeString().replace(/^\D*!/, '')
          var data0 = option.series[0].data
          var data1 = option.series[1].data
          data0.shift()
          data0.push(Math.round(Math.random() * 1000))
          data1.shift()
          data1.push((Math.random() * 10 + 5).toFixed(1) - 0)
          option.xAxis[0].data.shift()
          option.xAxis[0].data.push(axisData)
          option.xAxis[1].data.shift()
          option.xAxis[1].data.push(count++)
          myChart.setOption(option)
        }, 2100)
      },
      // 获取模块信息
      getMoudleData() {
        window.axiox.post(this.getApi('root/auth/index-info')
        ).then(res => {
          if (res.data.code === 0) {
            // console.log(res.data.add_info);
            this.module1 = res.data.add_info;
            this.module2 = res.data.money_info;
            this.module3 = res.data.audit_info;
          }
        }).catch(err => {
          console.log(err);
        })
      },
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .index {
    background-color: #f2f3f3;
    padding: 0;
  }

  .module {
    height: 340px;
    margin-bottom: 30px;
  }

  .module > div {
    float: left;
    height: 100%;
  }

  .m1-item, .m2-item, .m3-item {
    cursor: pointer;
  }

  /*上部模块1*/
  .module-1 {
    background-color: #fff;
    width: 30%;
    text-align: center;
    margin-right: 1.8%;
    border-radius: 5px;
    position: relative;
  }

  .module-1 > .m1-item {
    width: 50%;
    height: 50%;
    line-height: 30px;
    padding-top: 65px;
    box-sizing: border-box;
    float: left;
  }

  .border-h {
    background-color: #f1f1f1;
    width: 100%;
    height: 1px;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -0.5px;
  }

  .border-s {
    background-color: #f1f1f1;
    width: 1px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -0.5px;
  }

  .module-1 > .m1-item > p {
    font-size: 20px;
    font-weight: bold;
  }

  .module-1 > .m1-item > h3 {
    font-size: 16px;
  }

  ._06b651 {
    color: #06b651;
  }

  ._ff6511 {
    color: #ff6511;
  }

  ._ff1111 {
    color: #ff1111;
  }

  ._ae11ff {
    color: #ae11ff;
  }

  /*上部模块2*/
  .module-2 {
    width: 36.4%;
    margin-right: 1.8%;
    text-align: center;
  }

  .module-2 > .m2-item {
    width: 32%;
    height: 160px;
    margin-bottom: 20px;
    margin-right: 2%;
    padding-top: 30px;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: #fff;
    float: left;
  }

  .module-2 > div:nth-child(3n) {
    margin-right: 0;
  }

  .module-2 .i-box {
    color: #73879c;
  }

  .module-2 p {
    margin-top: 5px;
    line-height: 40px;
    font-size: 16px;
    font-weight: bold;
    color: #f51322;
  }

  .module-2 h3 {
    font-size: 16px;
  }

  ._fb5ea1 i {
    background-color: #fb5ea1;
  }

  ._45c1ec i {
    background-color: #45c1ec;
  }

  .module-2 ._95db43 {
    margin-right: 0;
  }

  ._95db43 i {
    background-color: #95db43;
  }

  ._f0c550 i {
    background-color: #f0c550;
  }

  ._eb70ea i {
    background-color: #eb70ea;
  }

  .module-2 ._31b4e1 {
    margin-right: 0;
  }

  ._31b4e1 i {
    background-color: #31b4e1;
  }

  /*上部模块3*/
  .module-3 {
    width: 30%;
    border-radius: 5px;
    overflow: hidden;
    font-size: 14px;
  }

  .module-3 > .m3-tit {
    line-height: 40px;
    padding-left: 30px;
    background-color: #f9f9f9;
  }

  .module-3 > .m3-tit span {
    padding-left: 7px;
    border-left: 2px solid #ffb413;
  }

  .module-3 > .m3-ul {
    background-color: #fff;
  }

  .m3-ul > .m3-item {
    height: 50px;
    line-height: 49px;
    border-bottom: 1px dashed #e9e9e9;
    padding-left: 30px;
    box-sizing: border-box;
  }

  .module-3 li span {
    display: inline-block;
    width: 140px;
    margin-right: 25px;
    text-align: right;
  }

  .module-3 li i {
    color: #f14c4c;
  }

  .module-3 li:last-child {
    border: none;
  }

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
</style>
