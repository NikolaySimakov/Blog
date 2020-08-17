import Vue from 'vue'
import VueRouter from 'vue-router'
import Profile from '@/views/Profile.vue'
import Signin from '@/views/Signin.vue'
import Signup from '@/views/Signup.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  }, 
  {
    path: '/user/:id',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
    meta: {
        guest: true
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
        guest: true
    }
  },
  {
    path: '*',
    redirect: '/signin'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
