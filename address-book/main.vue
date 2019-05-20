<template>
  <div
    class="address-book"
    :class="{
      'address-book--limit-high': limitHigh
    }"
  >

    <div ref="scroller" class="address-book__scroller">
      <template v-for="(items, index) in formatData">
        <div
          class="address-book__letter address-book__letter-index border--b"
          :style="{
            color: !letterBarVisible && index === nextIndex ? highlightColor : 'inherit'
          }"
          :key="items.letter"
        >
          <div
            v-if="index > 0"
            v-show="index === nextIndex && !letterBarVisible"
            class="address-book__letter__prev border--b"
          >
            <div class="address-book__letter__bg" :style="{ opacity: index === nextIndex ? 1 - letterBgOpacity : 0 }"></div>
            <div class="address-book__letter__name">{{letters[index - 1]}}</div>
          </div>

          <div
            class="address-book__letter__bg"
            :style="{ opacity: index === nextIndex ? letterBgOpacity : index === activeIndex ? 0 : 1 }"
          >
          </div>

          <div class="address-book__letter__name">{{items.letter}}</div>
        </div>

        <template v-for="(item, index) in items.list">
          <div class="address-book__cell" @click="$emit('cell-click', item)" :class="{ 'border--t': index !== 0 }" :key="item[letterKey] + item[nameKey]">
            <slot :item="item">
              {{item[nameKey]}}
            </slot>
          </div>
        </template>
      </template>
    </div>

    <div
      v-show="letterBarVisible && activeIndex > -1"
      :style="{
        color: highlightColor
      }"
      class="address-book__letter address-book__letter--fixed border--b"
    >
      {{activeLetter}}
    </div>

    <div v-if="letterNav" class="address-book__nav" :class="{ 'address-book__nav--touching': touching && touchState }">
      <div
        class="address-book__nav__touch"
        @touchstart.prevent="onTouchstart"
        @touchmove.prevent="onTouchmove"
        @touchend="onTouchend"
      >
        <template v-for="(letter, index) in letters">
          <div
            :style="{
              color: index === activeIndex ? '#fff' : 'inherit',
              background: index === activeIndex ? highlightColor : 'inherit'
            }"
            class="address-book__nav__letter"
            :data-letter="letter"
            :key="letter">
            {{letter}}
          </div>
        </template>
      </div>
    </div>

    <transition name="opacity-fade">
      <div v-show="touching && touchLetter" class="address-book__tips" :style="{background: highlightColor}">{{touchLetter}}</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'address-book',
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
    }
  },
  data () {
    return {
      innerHeight: window.innerHeight,
      ...this.formatFunc(),
      letterBarHeight: 0,
      letterBarTops: [],
      letterNavSize: 0,
      letterNavTops: [],
      activeLetter: '',
      activeIndex: -1,
      nextIndex: -1,
      letterBgOpacity: 1,
      letterBarVisible: false,
      touching: false,
      touchLetter: ''
    }
  },
  computed: {
    elm () {
      return this.limitHigh ? this.$refs.scroller : window
    },
    minClientY () {
      return this.letterNavTops[0]
    },
    maxClientY () {
      return this.letterNavTops[this.letterLen - 1] + this.letterNavSize
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.doLayout()
      window.addEventListener('resize', this.doLayout, false)

      this.elm.addEventListener('scroll', this.scroll, false)
    })
  },
  destroyed () {
    window.removeEventListener('resize', this.doLayout)
    this.elm.removeEventListener('scroll', this.scroll)
  },
  methods: {
    scroll () {
      // console.time('a')
      const scrollTop = this.limitHigh ? this.$refs.scroller.scrollTop : document.documentElement.scrollTop || document.body.scrollTop

      if (scrollTop < 0) {
        return
      }

      const nextIndex = this.letterBarTops.findIndex(t => t > scrollTop)
      const index = nextIndex === -1 ? this.letterLen - 1 : nextIndex - 1

      let activeLetter = index > -1 ? this.letters[index] : '',
          letterBgOpacity = 1,
          letterBarVisible = true,
          dist;

      if (nextIndex > -1) {
        if ((dist = this.letterBarTops[nextIndex] - scrollTop) && dist >= 0 && dist <= this.letterBarHeight) {
          activeLetter = this.letters[nextIndex]
          letterBgOpacity = dist / this.letterBarHeight
          letterBarVisible = false
        }
      }

      this.nextIndex = nextIndex
      this.activeIndex = index
      this.activeLetter = activeLetter
      this.letterBgOpacity = letterBgOpacity
      this.letterBarVisible = letterBarVisible

      // console.timeEnd('a')
    },
    onTouchstart (e) {
      this.touching = true
      this.touchLetter = e.target.getAttribute('data-letter')
    },
    onTouchmove (e) {
      this.onTouching(e.targetTouches[0].clientY, this.touchDirect)
    },
    onTouchend (e) {
      this.touching = false
      this.onTouching(e.changedTouches[0].clientY, true)
    },
    onTouching (clientY, touchDirect) {
      if (clientY < this.minClientY || clientY > this.maxClientY) {
        return
      }
      const activeIndex = this.letterNavTops.findIndex(t => t > clientY) - 1

      this.touchLetter = this.letters[activeIndex]
      touchDirect && this.scrollTo(this.letterBarTops[activeIndex])
    },
    scrollTo (top) {
      if (this.limitHigh) {
        this.elm.scrollTop = top
      } else {
        this.elm.scrollTo(0, top)
      }
    },
    doLayout () {
      if (this.letterNav) {
        this.innerHeight = window.innerHeight
        this.letterNavSize = document.querySelector('.address-book__nav__letter').offsetHeight
        const letterLen = this.letterLen
        const letterNavTops = []
        const navClientY = (this.innerHeight - this.letterNavSize * letterLen) / 2
        let i = -1
        while (i++ < letterLen) {
          letterNavTops.push(this.letterNavSize * i + navClientY)
        }
        this.letterNavTops = letterNavTops
      }

      const letterBars = document.querySelectorAll('.address-book__letter-index')
      const letterBarTops = []

      Array.prototype.forEach.call(letterBars, elm => {
        letterBarTops.push(elm.offsetTop)
      })
      this.letterBarHeight = letterBars[0].offsetHeight
      this.letterBarTops = letterBarTops
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

.address-book {
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
    position: relative;
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    font-weight: bold;
    background: #fff;
    &--fixed {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 0 15px;
    }
    &__prev {
      position: absolute;
      top: -100%;
      left: 0;
      width: 100%;
      background: #fff;
    }
    &__bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 1;
      background: @defaultBg;
    }
    &__name {
      position: relative;
      padding: 0 15px;
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
    font-weight: bold;
    border-radius: 17px;
    transform: translate3d(0, -50%, 0);
    &--touching {
      background: rgba(0, 0, 0, .1);
    }
    &__touch {
      position: relative;
      padding: 0 8px;
    }
    &__letter {
      width: 18px;
      height: 18px;
      line-height: 18px;
      font-size: 14px;
      border-radius: 50%;
      user-select: none;
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
