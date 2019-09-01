<template>
  <transition name="slide-right">
    <template v-if="rendered">
      <div v-show="currentValue" class="popup-v-ibar">
        <v-ibar
          ref="vibar"
          scrollElement=".popup-v-ibar"
          :data="mockData"
        >
          <template v-slot="slotProps">
            <div @click="onCellClick(slotProps.item)" class="cell">
              {{ slotProps.item.name }}
            </div>
          </template>
        </v-ibar>
      </div>
    </template>
  </transition>
</template>

<script>
import mockData from '../mock.js'
import VIbar from '../../v-ibar/main'

export default {
  name: 'popup-v-ibar',
  components: {
    VIbar
  },
  props: {
    value: Boolean
  },
  data () {
    return {
      rendered: this.value,
      currentValue: this.value,
      mockData
    }
  },
  methods: {
    onCellClick (item) {
      this.$eventBus.$emit('on-v-ibar-select', item)
      this.$router.back()
    }
  },
  watch: {
    value (vl) {
      this.currentValue = vl
    },
    currentValue (vl) {
      if (vl) {
        if (this.rendered) {
          this.$nextTick(function () {
            this.$refs.vibar.scrollTo(0)
            this.$refs.vibar.doLayout()
          })
        }
        this.rendered = vl
      }
      this.$emit('input', vl)
    }
  }
}
</script>

<style lang="less">
.popup-v-ibar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f0f5f9;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
  overflow-y: auto;
}

@keyframes slide-right-enter {
  from {
    transform: translate3d(100%, 0, 0);
  }
}

@keyframes slide-right-leave {
  to {
    transform: translate3d(100%, 0, 0);
  }
}

.slide-right {
  &-enter-active {
    animation: slide-right-enter .3s both;
  }
  &-leave-active {
    animation: slide-right-leave .3s both;
  }
}
</style>
