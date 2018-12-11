import Vue from 'vue'
import Router from 'vue-router'
import Index from './pages/Index.vue'
import Register from './pages/Register.vue'
import NotFound from './pages/404.vue'
import Login from './pages/Login.vue'
import Info from './components/Info.vue'
import Home from './components/Home.vue'
import Fundlist from './components/Fundlist.vue'
import vue from './main.js';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
          props: {
            user: 'looyulong'
          }
        }, 
        {
          path: 'info',
          name: 'info',
          component: Info,
          props: {
            avatar: '//www.gravatar.com/avatar/9c80f9ac27886f26f3475cc71e265721?s=200&r=pg&d=mm',
            name: 'looyulong',
            identity: '管理员'
          }
        },{
          path: 'fundlist',
          name: 'fundlist',
          component: Fundlist
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/info',
      name: 'info',
      component: Info,
      props: {
        avatar: '//www.gravatar.com/avatar/9c80f9ac27886f26f3475cc71e265721?s=200&r=pg&d=mm',
        name: 'outer looyulong',
        identity: '管理员'
      }
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to: ', to)
  // console.log('from: ', from)
  const { path } = to
  if (path === '/register' || path === '/login') {
    next()
    return false
  }
  const isAuthentication = vue || false
  const haveToken = localStorage.eleToken || false
  if (isAuthentication) {
    //app路由跳转
    next()
  } else {
    //浏览器刷新跳转
    if (!haveToken) {
      next('/login')
      return false
    } else (
      Vue.http.get('http://localhost:8000/api/users/current')
        .then(res => next())
        .catch(err => next('/login'))
    )
  }
  // let isLogined = false
  //在没有登录的情况下，访问除/register和/login外的地址，就会跳转登录页面
  //下面这种逻辑会导致过多递归而报错：
  // if (!isLogined & (path !== '/register' || path !== '/login')) {
  //   next('/login')
  //   return false
  // }
  // next()
  // if (path === '/register' || path === '/login') {
  //   next()
  // }else{
  //   isLogined ? next() : next('/login')
  // }
  //这样写也不行：
  // if (isLogined) {
  //   next()
  // }else{
  //   if (path !== '/register' || path !== '/login') 
  //   next('/login')
  // }
})

export default router