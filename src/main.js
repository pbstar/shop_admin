import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入 axios
import axios from 'axios'
// 导入字体图标
// import './assets/font/iconfont.css'
// 导入全局样式文件
import './assets/css/common.css'
/* 引入 完整的 elementui 组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI) */
/**
 * 按需引入 elementui 组件库
 */
import {
  Form, FormItem, Input, Button, Message, Container, Header,
  Aside, Main, Menu, Submenu, MenuItem, MenuItemGroup, Row, Col,
  Table, TableColumn, Switch, Dialog, MessageBox, Tag, Link, Tree
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(MenuItemGroup)
  .use(Row)
  .use(Col)
  .use(Table)
  .use(TableColumn)
  .use(Switch)
  .use(Dialog)
  .use(Tag)
  .use(Link)
  .use(Tree)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
// 配置axios 的默认请求的基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = localStorage.getItem('token')
  return config
})
axios.interceptors.response.use(res => {
  const { msg, status } = res.data.meta
  if (status === 400 && msg === '无效token') {
    router.push('login')
  }
  return res
})
// 将 axios 作为 Vue 类的原型对象上的一个属性
Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
