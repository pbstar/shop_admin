import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import Goods from '../views/Goods'
import Category from '../views/Category'
import Users from '../views/Users'
import Roles from '../views/Roles'
import Rights from '../views/Rights'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Homes',
    component: Home,
    children: [
      {
        path: 'users',
        name: 'Users',
        component: Users
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles
      },
      {
        path: '/rights',
        name: 'Rights',
        component: Rights
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/goods',
    name: 'Goods',
    component: Goods
  },
  {
    path: '/category',
    name: 'Category',
    component: Category
  }

]

const router = new VueRouter({
  routes
})
/**
 * 导航守卫
 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const token = localStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
