<template>
  <div class="page-example2">
    <v-ibar :data="mockData" :touch-state="false" limit-high>
      <template v-slot="slotProps">
        <div class="cell">
          {{ slotProps.item.name }}
        </div>
      </template>
    </v-ibar>
  </div>
</template>

<script>
import mockData from '../mock.js'
import VIbar from '../../v-ibar/main'

export default {
  name: 'page-example2',
  components: {
    VIbar
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
}
</style>
