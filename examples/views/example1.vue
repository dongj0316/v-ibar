<template>
  <div class="page-example1">
    <v-address-book :data="mockData"></v-address-book>
  </div>
</template>

<script>
import mockData from '../mock.js'
import VAddressBook from '../../v-address-book/main'

export default {
  name: 'page-example1',
  components: {
    VAddressBook
  },
  data () {
    return {
      mockData
    }
  }
}
</script>
