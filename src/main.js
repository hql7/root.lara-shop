// 引入样式
require('./assets/css/all.css')
require('./assets/css/clear.css')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 引入资源
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store/store'
import Axiox from 'axios'
import {
  Pagination,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Radio,
  Checkbox,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Tooltip,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tree,
  Icon,
  Upload,
  Rate,
  Loading,
  MessageBox,
  RadioGroup,
  Message,
  Col,
  Notification
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Vuex)

// 按需加载
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tree)
Vue.use(Icon)
Vue.use(Rate)
Vue.use(Loading)
Vue.use(Upload)
Vue.use(RadioGroup)
Vue.use(Col)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox
Vue.prototype.$notify = Notification

// 引入自定义插件
import util from './util/util'

Vue.use(util)

// 初始化网络请求组件(开启跨域请求)
Axiox.defaults.withCredentials = true
Axiox.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
window.axiox = Axiox

// 是否登陆
router.beforeEach((to, from, next) => {
  // NProgress.start();
  store.commit('setPage', 1);
  if (to.path === '/login') {
    sessionStorage.removeItem('user')
  }
  let user = JSON.parse(sessionStorage.getItem('user'))
  if (!user && to.path !== '/login') {
    next({path: '/login'})
  } else {
    next()
  }
})

// 添加一个请求拦截器
axiox.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 添加一个响应拦截器
axiox.interceptors.response.use(function (response) {
  // 全局请求响应若code为2则登录过期 指向登录页
  if (response.data.code === 2) {
    router.push('/login')
  }
  // Do something with response data

  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
