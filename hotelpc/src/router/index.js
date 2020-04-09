import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Console from '../components/Console.vue'
import OrderManagement from '../components/OrderManagement.vue'
import StaffManagement from '../components/StaffManagement.vue'
import PictureManagement from '../components/PictureManagement.vue'
import RestaurantOrderManagement from '../components/RestaurantOrderManagement.vue'
import RestaurantMenuManagement from '../components/RestaurantMenuManagement.vue'
import DataManagement from '../components/DataManagement.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    //登录
    path: '/login',
    component: Login
  },
  {
    //主页
    path: '/home',
    component: Home,
    redirect: '/console',
    children: [{
        path: '/console',
        component: Console
      },
      {
        path: '/orderManagement',
        component: OrderManagement
      },
      {
        path: '/staffManagement',
        component: StaffManagement
      },
      {
        path: '/pictureManagement',
        component: PictureManagement
      },
       {
         path: '/restaurantOrderManagement',
         component: RestaurantOrderManagement
       },
        {
          path: '/restaurantMenuManagement',
          component: RestaurantMenuManagement
        },
         {
           path: '/dataManagement',
           component: DataManagement
         },
    ]
  }
]


// 路由拦截
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router