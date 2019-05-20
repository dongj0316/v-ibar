import VAddressBook from './main.vue'

VAddressBook.install = function (Vue) {
  Vue.component(VAddressBook.name, VAddressBook)
}

export default VAddressBook