import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.prototype.$eventBus = new Vue()

Vue.config.productionTip = false

document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('touchstart', function () {})
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
