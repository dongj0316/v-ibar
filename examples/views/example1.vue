<template>
  <div class="page-example1">
    <v-ibar :data="mockData" :touchDirect="false">
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
  name: 'page-example1',
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
