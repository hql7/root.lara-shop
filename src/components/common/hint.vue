<template>
  <div class="hint">
    <h3>{{title}}</h3>
    <p>{{content}}<a :href="link.url">{{link.name}}</a></p>
  </div>
</template>

<script>
  export default {
    props: {
      title: String,
      content: String,
      link: {
        type: Object,
        default: function () {
          return {name: '', url: ''}
        }
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hint {
    background-color: #ebf8fd;
    border: 1px solid #ceeef9;
    border-radius: 5px;
    padding: 5px 15px 7px 20px;
    margin-bottom: 12px;
  }

  .hint h3 {
    line-height: 30px;
    color: #84d2f1;
  }

  .hint p {
    line-height: 22px;
  }

  .hint a {
    color: #1cadf1;
  }
</style>
