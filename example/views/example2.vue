<template>
  <div class="page-example2">
    <address-book :data="mockData" limit-high></address-book>
  </div>
</template>

<script>
import mockData from '../mock.js'
import AddressBook from '../../address-book/main'

export default {
  name: 'page-example2',
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

<style lang="less">
.page-example2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
