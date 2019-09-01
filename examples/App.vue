<template>
  <div id="app">
    <router-view/>

    <popup-v-ibar v-model="popupVisible"></popup-v-ibar>
  </div>
</template>

<script>
import PopupVIbar from './components/popup-v-ibar'

export default {
  name: 'app',
  components: {
    PopupVIbar
  },
  data () {
    return {
      popupVisible: false
    }
  },
  created () {
    this.$eventBus.$on('toggle-v-ibar', popupVisible => {
      this.popupVisible = popupVisible
    })
  }
}
</script>

<style lang="less">
@defaultBg: #f0f5f9;

* {
  margin: 0;
  padding: 0;
}
html {
  -webkit-tap-highlight-color: transparent;
}
body {
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: @defaultBg;
}
.cell {
  position: relative;
  padding: 10px 15px;
  background: #fff;
  & + .cell:before {
    content: '';
    position: absolute;
    top: 0;
    left: 15px;
    right: 15px;
    pointer-events: none;
    border-top: 1px solid @defaultBg;
    transform: scaleY(.5);
  }
}
</style>
