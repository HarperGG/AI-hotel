import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// import https from '../https.js'
// 引入全局样式
import './assets/css/global.css'
import './assets/font/iconfont.css'
// 导入axios
import axios from 'axios'
import Message from 'element-ui'

// 导入qs
import qs from 'qs'

// 导入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts



//设置根路径
axios.defaults.baseURL = `http://jiangwei.online:8080/`


// 挂载到vue的原型上
Vue.prototype.$http = axios
// 挂载qs到全局
Vue.prototype.$qs = qs

// 给请求头设置拦截器,将token放入Authorization中，传入服务器
axios.interceptors.request.use(
  config => {
    config.headers.token = window.sessionStorage.getItem('token')
    return config
  },
  err => {
    // 设置请求出错的信息。
    return Promise.reject(err.response.data)
  }
)

// 给响应头设置拦截器。
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {

    if (error.response.status == 401) {
      Message({
        dangerouslyUseHTMLString: true,
        showClose: true,
        message: eval('(' + error.response.data + ')').data.join(
          '身份失效<br><br>跳转登录页面！'
        ),
        type: 'error'
      })
      setTimeout(()=>{
        this.$router.push('/login')
      },1000)
    }
    /*在这里设置token过期的跳转*/
    return Promise.reject(error)
  }
)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
// 创建link标签