<template>
  <div class="page">
    <el-pagination
      @current-change="to_page"
      :current-page="index"
      layout="total, prev, pager, next, jumper"
      :page-count="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        index: 1,
        total: 1
      }
    },
    props: {
      totalPage: Number,
      currentPage: Number
    },
    watch: {
      totalPage(val) {
        this.total = val
      },
      currentPage(val) {
        this.index = val
      }
    },
    methods: {
      to_page(val) {
        this.$store.commit('setPage', val);
        this.$emit('toPage')
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page {
    padding: 10px 0 20px;
    overflow: hidden;
  }

  .el-pagination {
    float: right;
  }
</style>
