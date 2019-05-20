<template>
  <div class="page-example2">
    <v-address-book :data="mockData" :touch-state="false" limit-high></v-address-book>
  </div>
</template>

<script>
import mockData from '../mock.js'
import VAddressBook from '../../v-address-book/main'

export default {
  name: 'page-example2',
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

<style lang="less">
.page-example2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
