<template>
  <div class="home">
    <menuNav></menuNav>
    <div class="all-right">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  import menuNav from './menuNav.vue'

  export default {
    computed: {
      loading() {
        return this.$store.state.loading
      }
    },
    components: {menuNav}
  }
</script>
