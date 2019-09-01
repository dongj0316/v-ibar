import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/index.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        {
          path: '/example4',
          name: 'example4',
          component: () => import(/* webpackChunkName: "example4" */ './views/example4.vue')
        }
      ]
    },
    {
      path: '/example1',
      name: 'example1',
      component: () => import(/* webpackChunkName: "example1" */ './views/example1.vue')
    },
    // {
    //   path: '/example2',
    //   name: 'example2',
    //   component: () => import(/* webpackChunkName: "example2" */ './views/example2.vue')
    // },
    {
      path: '/example3',
      name: 'example3',
      component: () => import(/* webpackChunkName: "example3" */ './views/example3.vue')
    }
  ]
})
