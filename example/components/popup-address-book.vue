<template>
  <transition name="slide-right">
    <div v-show="currentValue" class="popup-address-book">
      <address-book
        ref="addressBook"
        :data="mockData"
        search-bar
        @back="$router.back()"
        @cell-click="onCellClick"
        limit-high>
      </address-book>
    </div>
  </transition>
</template>

<script>
import mockData from '../mock.js'
import AddressBook from '../../address-book/main'

export default {
  name: 'popup-address-book',
  components: {
    AddressBook
  },
  props: {
    value: Boolean
  },
  data () {
    return {
      currentValue: this.value,
      mockData
    }
  },
  methods: {
    onCellClick (item) {
      this.$eventBus.$emit('on-address-book-select', item)
      this.$router.back()
    }
  },
  watch: {
    value (vl) {
      this.currentValue = vl
    },
    currentValue (vl) {
      if (vl) {
        this.$nextTick(function () {
          this.$refs.addressBook.scrollTo(0)
          this.$refs.addressBook.doLayout()
        })
      }
      this.$emit('input', vl)
    }
  }
}
</script>

<style lang="less">
.popup-address-book {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ccc;
  overflow: hidden;
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
