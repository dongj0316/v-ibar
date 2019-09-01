import VIbar from './main.vue'

VIbar.install = function (Vue) {
  Vue.component(VIbar.name, VIbar)
}

export default VIbar