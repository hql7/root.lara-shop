<template>
  <div class="crumb">
    <i class="iconfont icon-fanhui u-goBack" @click="go_back"></i>{{from}}<i class="iconfont icon-zuo u-connect"></i>{{now}}
  </div>
</template>

<script>
  export default {
    props: {
      from: String,
      now: String
    },
    methods: {
      go_back () {
        // 触发返回点击事件
        this.$emit('goBack')
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .crumb {
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 15px;
  }

  .u-goBack {
    font-size: 30px;
    color: #999999;
    vertical-align: -5px;
    margin-right: 15px;
  }

  .u-goBack:hover {
    color: coral;
  }

  .u-connect {
    margin: 0 3px;
  }
</style>
