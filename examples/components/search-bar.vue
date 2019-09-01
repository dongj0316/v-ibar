<template>
  <form
    class="search-bar"
    :class="{ 'search-bar--fixed': fixed, 'search-bar--noback': !back }"
    :style="{ zIndex: zIndex }"
    @submit.prevent="onSumbit"
    @touchmove.prevent
    action="">
    <div v-if="back" @click="$emit('back')" class="search-bar__back" :class="{ 'search-bar__back--show': !isFocus && !currentVal }"></div>
    <div class="search-bar__input">
      <div class="search-bar__input__icon"></div>
      <input
        ref="input"
        v-model.trim="compositiontext"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @compositionend="onCompositionend"
        :placeholder="placeholder"
        type="search"
      />
      <div @click="onClear" v-show="currentVal" class="search-bar__input__clear">
        <div></div>
      </div>
    </div>

    <div
      class="search-bar__cancel"
      :class="{ 'search-bar__cancel--show': isFocus || currentVal }"
      @click="onCancel"
    >取消</div>
  </form>
</template>

<script>
export default {
  name: 'search-bar',
  props: {
    back: {
      type: Boolean,
      default: true
    },
    fixed: Boolean,
    zIndex: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: '搜索'
    },
    value: String
  },
  data () {
    return {
      isFocus: false,
      currentVal: this.value || '',
      compositiontext: this.value || ''
    }
  },
  methods: {
    onFocus () {
      this.isFocus = true
      this.$emit('focus')
    },
    onBlur () {
      this.isFocus = false
      this.$emit('blur')
    },
    onClear () {
      this.currentVal = ''
      this.compositiontext = ''
      this.isFocus = false
      this.blur()
      this.$emit('clear')
    },
    onInput () {
      if (this.currentVal != this.compositiontext) {
        this.currentVal = this.compositiontext
      }
    },
    onCompositionend () {
      this.currentVal = this.compositiontext
    },
    onCancel () {
      this.currentVal = ''
      this.compositiontext = ''
      this.isFocus = false
      this.blur()
      this.$emit('cancel')
    },
    blur () {
      this.$refs.input.blur()
    },
    focus () {
      this.$refs.input.focus()
    },
    cancel () {
      this.currentVal = ''
      this.compositiontext = ''
      this.isFocus = false
      this.blur()
    },
    onSumbit () {
      if (!this.currentVal) {
        return
      }
      this.$emit('search', this.currentVal)
    }
  }
}
</script>

<style lang="less" scoped>
@defaultBg: #ededed;
@searchIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAflBMVEUAAACWlpiWl5mVlZWhoaGWl5mVlpmWl5mWl5iTk5OVlpiVlpmWl5mVlpmWlpmWl5mbm5uWl5mWlpmVl5mWmJmWlpmWl5iVl5iWlpiWl5mWl5iWl5qWl5iVl5iVl5mWl5mXl5qWl5mWlpuVl5mWlpaVl5mVmJiVlpiVlZuWl5ntrIFuAAAAKXRSTlMA3oMJBvnJxL4N9vLi1qYbF7pgPiHt0J2MeFlEN6+UaFBNMzERfHHnKToJjZcAAAEWSURBVDjLpZHZcoJAFETZd1BAEASXuCXn/38wKXVyB4YyD+mn7rqn6C7Gesk9FW3jZ6FztpZ0dVKU2p15rxtouqEeqi4AouvsvvPxHfcVNhHYq8n9KyHcaPkOgadlLyeyJjqBo8WeLJ513vDlk3FCNR/t2RSykE/LUEXyu6JgawKuz4fyuTRoKumVbRgWgC0HZRPGBeAgxba0adrTKRtyXABy7so6lOZ9BRflz/LXRDcyCQHF/B6n+mNcMGbuSddadEjqyUscmA0P8StJYw7k60llCWHtPTcXPGQ/CGlJIS23XdECwaU0iWvf8lC6H35WREKINqdjvxufRa4QpjRi9Y4IgeyfRPAXEQdAbr0n5BGWiWi0vgGCjRwxYRq+/AAAAABJRU5ErkJggg==';

.search-bar {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 24px;
  overflow: hidden;
  background: @defaultBg;
  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
  &--noback {
    padding-left: 15px;
  }
  &__back {
    position: relative;
    padding: 15px 0;
    width: 3em;
    margin-left: -2em;
    text-align: center;
    transition: margin .2s;
    user-select: none;
    &--show {
      margin-left: 0;
    }
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      transform: translate3d(-50%, -50%, 0) rotate(-45deg);
      border: 2px solid #969799;
      border-right: none;
      border-bottom: none;
    }
  }
  &__input {
    flex: 1;
    display: flex;
    align-items: stretch;
    border-radius: 3px;
    background: #fff;
    overflow: hidden;
    &__icon {
      width: 2em;
      background: url(@searchIcon) center center / auto 13px no-repeat;
    }
    input {
      box-sizing: border-box;
      width: 100%;
      flex: 1;
      padding: 8px 0;
      font-size: inherit;
      line-height: 24px;
      border: none;
      appearance: none;
      &:focus {
        outline: none;
      }
      &::-webkit-search-cancel-button {
        appearance: none;
      }
    }
    &__clear {
      position: relative;
      width: 3em;
      overflow: hidden;
      > div {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        transform: translate3d(-50%, -50%, 0);
        border-radius: 50%;
        background: #cdcdcd;
        &:before {
          content: '';
          position: absolute;
          top: 3px;
          left: 7px;
          width: 2px;
          height: 10px;
          transform: rotate(45deg);
          background: #fff;
        }
        &:after {
          content: '';
          position: absolute;
          top: 3px;
          left: 7px;
          width: 2px;
          height: 10px;
          transform: rotate(-45deg);
          background: #fff;
        }
      }
    }
  }
  &__cancel {
    padding: 15px 0;
    width: 4em;
    margin-right: -3em;
    text-align: center;
    transition: margin .2s;
    user-select: none;
    &--show {
      margin-right: 0;
    }
  }
}
</style>
