import AddressBook from './main.vue'

AddressBook.install = function (Vue) {
  Vue.component(AddressBook.name, AddressBook)
}

export default AddressBook