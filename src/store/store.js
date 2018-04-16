import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    index: 1, // 页码
    loading: false
  },
  mutations: {
    setPage(state, index) {
      state.index = index
    },
    setLoad(state, val) {
      state.loading = val
    }
  }
})

export default store

