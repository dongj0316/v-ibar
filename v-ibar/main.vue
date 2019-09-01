<template>
  <div
    class="v-ibar"
  >

    <div class="v-ibar__scroller">
      <template v-for="(items, index) in normalizedData">
        <div
          :style="anchorBarHeights[index] && { height: `${anchorBarHeights[index]}px` }"
          :key="items.anchor"
        >
          <div
            class="v-ibar__anchor border--b"
            :class="{
              'v-ibar__anchor--active': !isInTransition && activeIndex === index
            }"
            :style="[
              (index === activeIndex || index === prevIndex) && transitionBarStyle,
              {
                transform: `translate3d(0, ${transY(index)}px, 0)`
              }
            ]"
          >
            {{items.anchor}}
          </div>
        </div>

        <template v-for="item in items.list">
          <slot :item="item"></slot>
        </template>
      </template>
    </div>

    <div
      v-if="anchorNav"
      class="v-ibar__nav" 
      :style="touchState && touching && { backgroundColor: 'rgba(0,0,0,.05)' }"
    >
      <div
        @touchstart.prevent
        @touchmove.prevent="onTouchmove"
        @touchend="onTouchend"
      >
        <template v-for="(anchor, index) in anchors">
          <div
            class="v-ibar__nav__anchor"
            :style="index === activeIndex && transitionNavStyle"
            :data-anchor="anchor"
            :data-offsettop="anchorBarTops[index]"
            :key="anchor">
            {{anchor}}
          </div>
        </template>
      </div>
    </div>

    <transition name="opacity-fade">
      <div v-show="touching" class="v-ibar__tips" :style="{backgroundColor: highlightColor}">{{touchAnchor}}</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'v-ibar',
  props: {
    scrollElement: String,
    data: {
      type: Array,
      required: true
    },
    anchorKey: {
      type: String,
      default: 'anchor'
    },
    anchorNav: {
      type: Boolean,
      default: true
    },
    highlightColor: {
      type: String,
      default: '#07c160'
    },
    touchState: {
      type: Boolean,
      default: true
    },
    touchDirect: {
      type: Boolean,
      default: true
    },
    fixedTop: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      ...this.normalizeFunc(),
      anchorBarHeights: [],
      anchorBarTops: [],
      prevIndex: -1,
      activeIndex: -1,
      isInTransition: false,
      touching: false,
      touchAnchor: ''
    }
  },
  computed: {
    transitionBarStyle () {
      return {
        color: this.highlightColor,
        background: 'rgb(255,255,255)'
      }
    },
    transitionNavStyle() {
      return {
        color: this.highlightColor
      }
    },
    diffTop () {
      const { anchorBarTops, anchorBarHeights, prevIndex, activeIndex } = this
      return prevIndex > -1
        ? anchorBarTops[activeIndex] - anchorBarTops[prevIndex] - anchorBarHeights[prevIndex]
        : 0
    }
  },
  mounted () {
    this.$nextTick(function () {
      const { scrollElement, anchorBarTops, normalizedData } = this
      const scroller = scrollElement ? document.querySelector(scrollElement) : window
      const getKey = 'scrollTop' in scroller ? 'scrollTop' : 'pageYOffset'
      const scrollTo = getKey === 'scrollTop' ? top => (scroller.scrollTop = top) : top => scroller.scrollTo(0, top)
      const scrollFun = () => this.scroll(scroller[getKey])

      scroller.addEventListener('scroll', scrollFun, false)
      this.$once('hook:beforeDestroy', () => {
        scroller.removeEventListener('scroll', scrollFun)
      })

      this.scrollTo = target => {
        if (typeof target === 'object') {
          target = anchorBarTops[normalizedData.findIndex(item => item.anchor === target.anchor)] || 0
        }
        scrollTo(target)
      }
      this.doLayout()
    })
  },
  methods: {
    transY (index) {
      const { isInTransition, activeIndex, prevIndex, diffTop, fixedTop } = this
      return isInTransition
        ? index === prevIndex
          ? diffTop
          : 0
        : index === activeIndex
          ? fixedTop
          : 0
    },
    scroll (scrollTop) {
      if (scrollTop < 0) {
        return
      }

      const { anchorBarTops, anchorLen, anchorBarHeights, fixedTop } = this

      let activeIndex = anchorBarTops.findIndex((t, i) => t - fixedTop >= scrollTop + (anchorBarHeights[i - 1] || 0))
      let isInTransition = false

      activeIndex = activeIndex === -1 ? anchorLen - 1 : activeIndex - 1

      if (anchorBarTops[activeIndex] - scrollTop >= fixedTop) {
        isInTransition = true
      }

      this.activeIndex = activeIndex
      this.prevIndex = activeIndex - 1
      this.isInTransition = isInTransition
    },
    onTouchmove (e) {
      const { clientX, clientY } = e.touches[0]

      this.touching = true
      this.touchChange(clientX, clientY, this.touchDirect)
    },
    onTouchend (e) {
      const { clientX, clientY } = e.changedTouches[0]

      this.touching = false
      this.touchChange(clientX, clientY, true)
    },
    touchChange (x, y, touchDirect) {
      const activeElem = document.elementFromPoint(x, y)

      if (activeElem) {
        const { offsettop, anchor } = activeElem.dataset

        if (anchor && (this.touchAnchor !== anchor || !this.touching)) {
          this.touchAnchor = anchor
          touchDirect && this.scrollTo(offsettop)
        }
      }
    },
    doLayout () {
      const anchorBars = document.querySelectorAll('.v-ibar__anchor')
      const anchorBarTops = []
      const anchorBarHeights = []

      Array.prototype.forEach.call(anchorBars, anchorbar => {
        const { offsetTop, offsetHeight } = anchorbar
        anchorBarTops.push(offsetTop)
        anchorBarHeights.push(offsetHeight)
      })
      this.anchorBarTops = anchorBarTops
      this.anchorBarHeights = anchorBarHeights
    },
    normalizeFunc () {
      const { data, anchorKey } = this
      let normalizeJson = {}

      data.forEach(item => {
        const anchor = item[anchorKey]
        normalizeJson[anchor] = normalizeJson[anchor] || []
        normalizeJson[anchor].push(item)
      })

      const anchors = Object.keys(normalizeJson).sort((a, b) => a.charCodeAt() - b.charCodeAt())
      const anchorLen = anchors.length
      const normalizedData = anchors.map(anchor => ({
        anchor,
        list: normalizeJson[anchor]
      }))

      normalizeJson = null
      return {
        anchors,
        anchorLen,
        normalizedData
      }
    }
  }
}
</script>

<style lang="less" scoped>
@defaultBg: #f0f5f9;
@zIndex: 1;

.v-ibar {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  font-size: inherit;
  font-family: inherit;
  &__anchor {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    padding: 5px 15px;
    font-weight: bold;
    z-index: @zIndex;
    &--active {
      position: fixed;
    }
  }
  &__nav {
    position: fixed;
    top: 50%;
    right: 0;
    padding: 10px 0;
    text-align: center;
    border-radius: 17px;
    transform: translate3d(0, -50%, 0);
    z-index: @zIndex + 1;
    &__anchor {
      padding: 0 8px;
      line-height: 18px;
      font-size: 13px;
      border-radius: 50%;
      user-select: none;
      transform: scale(1);
    }
  }
  &__tips {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    line-height: 50px;
    font-size: 32px;
    text-align: center;
    font-weight: bold;
    color: #fff;
    transform: translate3d(-50%, -50%, 0);
    z-index: @zIndex + 1;
  }

  .border--b:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    border-bottom: 1px solid @defaultBg;
    transform: scaleY(.5);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}
@keyframes fade-out {
  to {
    opacity: 0;
  }
}
.opacity-fade {
  &-enter-active {
    animation: fade-in .3s both;
  }
  &-leave-active {
    animation: fade-out .3s both;
  }
}

</style>
