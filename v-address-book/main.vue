<template>
  <div
    class="v-address-book"
    :class="{
      'v-address-book--limit-high': limitHigh
    }"
  >

    <div ref="scroller" class="v-address-book__scroller">
      <template v-for="(items, index) in formatData">
        <div
          class="v-address-book__letter v-address-book__letter-index"
          :style="letterBarHeights[index] ? { height: `${letterBarHeights[index]}px` }: null"
          :key="items.letter"
        >
          <div
            class="v-address-book__letter__name border--b"
            :class="{'v-address-book__letter__name--fixed': !isInTransition && activeIndex === index}"
            :style="[
              index === activeIndex || index === activeIndex - 1 ? transitionBarStyle : null,
              activeIndex > 0 && index === activeIndex - 1 ? {
                transform: `translate3d(0, ${letterBarTops[activeIndex] - letterBarTops[index] - letterBarHeights[index]}px, 0)`
              } : null,
              !isInTransition && activeIndex === index ? { top: `${fixedTop}px` } : null
            ]"
          >
            {{items.letter}}
          </div>
        </div>

        <template v-for="(item, index) in items.list">
          <div class="v-address-book__cell" @click="$emit('cell-click', item)" :class="{ 'border--t': index !== 0 }" :key="item[letterKey] + item[nameKey]">
            <slot :item="item">
              {{item[nameKey]}}
            </slot>
          </div>
        </template>
      </template>
    </div>

    <div v-if="letterNav" class="v-address-book__nav" :class="{ 'v-address-book__nav--touching': touching && touchState }">
      <div
        class="v-address-book__nav__touch"
        @touchstart.prevent="onTouchstart"
        @touchmove.prevent="onTouchmove"
        @touchend="onTouchend"
      >
        <template v-for="(letter, index) in letters">
          <div
            class="v-address-book__nav__letter"
            :style="index === activeIndex ? transitionNavStyle : null"
            :data-index="index"
            :key="letter">
            {{letter}}
          </div>
        </template>
      </div>
    </div>

    <transition name="opacity-fade">
      <div v-show="touching" class="v-address-book__tips" :style="{backgroundColor: highlightColor}">{{letters[touchIndex]}}</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'v-address-book',
  props: {
    limitHigh: Boolean,
    data: {
      type: Array,
      required: true
    },
    letterKey: {
      type: String,
      default: 'letter'
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    letterNav: {
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
      ...this.formatFunc(),
      letterBarHeight: 0,
      letterBarHeights: [],
      letterBarTops: [],
      activeIndex: -1,
      isInTransition: false,
      touching: false,
      touchIndex: -1
    }
  },
  computed: {
    scroller () {
      return this.limitHigh ? this.$refs.scroller : window
    },
    transitionBarStyle () {
      return {
        color: this.highlightColor,
        backgroundColor: 'rgb(255, 255, 255)'
      }
    },
    transitionNavStyle() {
      return {
        color: this.highlightColor,
        transform: 'scale(1.3)'
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.doLayout()
      window.addEventListener('resize', this.doLayout, false)

      this.scroller.addEventListener('scroll', this.scroll, false)
    })
  },
  destroyed () {
    window.removeEventListener('resize', this.doLayout)
    this.scroller.removeEventListener('scroll', this.scroll)
  },
  methods: {
    scroll () {
      // console.time('a')
      const scrollTop = this.limitHigh ? this.$refs.scroller.scrollTop : window.pageYOffset

      if (scrollTop < 0) {
        return
      }

      let activeIndex = this.letterBarTops.findIndex((t, i) => t > scrollTop + (this.letterBarHeights[i - 1] || 0)) - 1
      activeIndex = activeIndex === -2 ? this.letterLen - 1 : activeIndex
      let isInTransition = false

      if (activeIndex > -1 && this.letterBarTops[activeIndex] - scrollTop >= 0) {
        isInTransition = true
      }

      this.activeIndex = activeIndex
      this.isInTransition = isInTransition

      // console.timeEnd('a')
    },
    onTouchstart (e) {
      this.touching = true
      this.hasMove = false
      this.touchIndex = +e.target.dataset.index
    },
    onTouchmove (e) {
      const { clientX, clientY } = e.touches[0]

      this.hasMove = true
      this.onTouching(clientX, clientY, this.touchDirect)
    },
    onTouchend (e) {
      const { clientX, clientY } = e.changedTouches[0]

      this.touching = false
      this.touchIndex = -1
      this.onTouching(clientX, clientY, this.hasMove ? !this.touchDirect : true)
    },
    onTouching (clientX, clientY, touchDirect) {
      const activeElem = document.elementFromPoint(clientX, clientY)

      if (activeElem) {
        const { index } = activeElem.dataset
        if (index && this.touchIndex !== +index) {
          this.touchIndex = +index
          touchDirect && this.scrollTo(this.letterBarTops[index])
        }
      }
    },
    scrollTo (top) {
      if (this.limitHigh) {
        this.scroller.scrollTop = top
      } else {
        this.scroller.scrollTo(0, top)
      }
    },
    doLayout () {
      const letterBars = document.querySelectorAll('.v-address-book__letter-index')
      const letterBarTops = []
      const letterBarHeights = []

      Array.prototype.forEach.call(letterBars, letterbar => {
        letterBarTops.push(letterbar.offsetTop)
        letterBarHeights.push(letterbar.offsetHeight)
      })
      this.letterBarTops = letterBarTops
      this.letterBarHeights = letterBarHeights
      this.letterBarHeight = letterBarHeights[0]
    },
    formatFunc () {
      let formatJson = {}
      this.data.forEach(function (item) {
        const letter = item[this.letterKey]
        formatJson[letter] = formatJson[letter] || []
        formatJson[letter].push(item)
      }, this)
      const letters = Object.keys(formatJson).sort((a, b) => {
        return a.charCodeAt() - b.charCodeAt()
      })
      const letterLen = letters.length
      const formatData = letters.map(letter => {
        return {
          letter,
          list: formatJson[letter]
        }
      })
      formatJson = null
      return {
        letters,
        letterLen,
        formatData
      }
    }
  }
}
</script>

<style lang="less" scoped>
@defaultBg: #ededed;

.v-address-book {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  background: #fff;
  font-size: inherit;
  font-family: inherit;
  &--limit-high, &--limit-high &__scroller {
    position: relative;
    height: 100%;
  }
  &--limit-high &__letter--fixed {
    position: absolute;
  }
  &__scroller {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  &__letter {
    line-height: 30px;
    font-size: 15px;
    font-weight: bold;
    &__name {
      position: relative;
      padding: 0 15px;
      transform: translate3d(0, 0, 0);
      background-color: @defaultBg;
      z-index: 500;
      &--fixed {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
      }
    }
  }
  &__cell {
    position: relative;
    display: flex;
    align-items: center;
    padding: 15px;
  }
  &__nav {
    position: fixed;
    top: 50%;
    right: 0;
    padding: 10px 0;
    text-align: center;
    border-radius: 17px;
    transform: translate3d(0, -50%, 0);
    z-index: 501;
    &--touching {
      background: rgba(0, 0, 0, .1);
    }
    &__touch {
      position: relative;
    }
    &__letter {
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
    z-index: 501;
  }

  .border--t:before {
    content: '';
    position: absolute;
    top: 0;
    left: 15px;
    right: 15px;
    pointer-events: none;
    border-top: 1px solid @defaultBg;
    transform: scaleY(.5);
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
