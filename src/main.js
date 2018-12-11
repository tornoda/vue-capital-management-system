import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vueResource from 'vue-resource'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.use(ElementUI)
Vue.use(vueResource)
Vue.config.productionTip = false

//用来保存Message实例
let loadingMessage = {}
const identifyUrl = 'http://localhost:8000/api/users/current'

//设置http拦截
//请求时触发
Vue.http.interceptors.push(req => {
  // console.log(localStorage.eleToken)
  // console.log('current req', req)
  const { url } = req
  const setHeads = () => {
    req.headers.set('Authorization', localStorage.eleToken || '')
  }
  if (url !== identifyUrl) {
    loadingMessage = ElementUI.Message({
      message: '请求中，请稍后。。。',
      type: 'info',
      duration: 0
    })
    setHeads()
  }
  setHeads()
})
//响应时触发
Vue.http.interceptors.push(() => {
  return (res) => {
    const { url } = res
    if (url !== identifyUrl) loadingMessage.close();
    const { status, body: { msg } } = res;
    //处理token过期
    //如果token过期，那么跳转登录页面
    //注意：其实这里无需删除旧token，登录后会覆盖；登录失败信息（请重新登录）在服务器返回的msg中已经写好
    //但是这里还是把过期的token删除了，因为需要通过eleToken是否存在来判断登录与否，从而设置路由守卫。查看'./router.js'
    if (status === 401) {
      ElementUI.Message({
        message: '登录已过期，请重新登录',
        type: 'error'
      })
      router.push('/login')
      localStorage.removeItem('eleToken')
      return false
    }
    //登录异常，提示信息
    // if (status !== 200) ElementUI.Message({
    //   message: msg || '请求失败',
    //   type: 'error'
    // })
  }
})

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')