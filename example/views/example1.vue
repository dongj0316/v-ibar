<template>
  <div class="page-example1">
    <address-book :data="mockData"></address-book>
  </div>
</template>

<script>
import mockData from '../mock.js'
import AddressBook from '../../address-book/main'

export default {
  name: 'page-example1',
  components: {
    AddressBook
  },
  data () {
    return {
      mockData
    }
  }
}
</script>
