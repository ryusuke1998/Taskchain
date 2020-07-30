import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signin from '../views/Signin.vue'
import Signup from '../views/Signup'
import Setting from '../views/Setting'
import Mypage from '../views/Mypage'
import Completedtask from '../views/Completedtask'
import Welcome from '../views/Welcome'
// import firebase from 'firebase'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/Signin',
      name: 'Signin',
      component: Signin
    },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path: '/Signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/Setting',
    name: 'Setting',
    component: Setting
  },
  {
    path: '/Mypage',
    name: 'Mypage',
    component: Mypage
  },
  {
    path: '/Completedtask',
    name: 'Completedtask',
    component: Completedtask
  },
  {
    path:'/',
    name: 'Welcome',
    component: Welcome
  }


  
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

    // router.beforeEach((to, from, next) => {
    //   firebase.auth().onAuthStateChanged((user) => {
    //     if(user && to.name === 'Welcome') {
    //       console.log(user);
    //       next({path: '/Home'});
    //     }else if(user === false){
    //       next({path: '/'});
    //     }else if(user && from.name === 'Signin'){
    //       next({path: '/Home'});
    //     }else {
    //       next()
    //     }
    //   })
    // })


export default router
