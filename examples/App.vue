<template>
  <div id="app">
    <router-view/>

    <popup-address-book v-model="popupVisible"></popup-address-book>
  </div>
</template>

<script>
import PopupAddressBook from './components/popup-address-book'

export default {
  name: 'app',
  components: {
    PopupAddressBook
  },
  data () {
    return {
      popupVisible: false
    }
  },
  created () {
    this.$eventBus.$on('toggle-address-book', popupVisible => {
      this.popupVisible = popupVisible
    })
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  -webkit-overflow-scrolling: touch;
}
html {
  -webkit-tap-highlight-color: transparent;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
