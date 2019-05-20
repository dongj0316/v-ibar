<template>
  <div @click="onClick" class="c-cell">
    <div class="c-cell__title">
      <slot name="title">{{title}}</slot>
    </div>
    <div v-show="hasValue" class="c-cell__value">
      <slot>{{value}}</slot>
    </div>
    <div v-show="!hasValue" class="c-cell__placeholder">{{placeholder}}</div>
    <div v-if="isLink" class="c-cell__arrow"></div>
  </div>
</template>

<script>
export default {
  name: 'c-cell',
  props: {
    title: String,
    value: [String, Number],
    isLink: {
      type: Boolean,
      default: true
    },
    placeholder: String,
    replace: Boolean,
    to: [String, Number]
  },
  computed: {
    hasValue () {
      return typeof this.value === 'number' && this.value === this.value || this.value
    }
  },
  methods: {
    onClick () {
      if (this.to && this.$router) {
        this.$router[this.replace ? 'replace' : 'push'](this.to)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.c-cell {
  box-sizing: border-box;
  position: relative;
  display: flex;
  padding: 10px 15px;
  font-size: 14px;
  line-height: 24px;
  &:active {
    background-color: rgba(0, 0, 0, .02);
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 15px;
    right: 0;
    pointer-events: none;
    border-top: 1px solid #ededed;
    transform: scaleY(.5);
  }
  &:first-child:before {
    left: 0;
  }
  &:last-child:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    border-bottom: 1px solid #ededed;
    transform: scaleY(.5);
  }
  &__title {
    min-width: 5em;
  }
  &__value {
    flex: 1;
  }
  &__placeholder {
    flex: 1;
    color: #969799;
  }
  &__arrow {
    position: relative;
    height: 24px;
    width: 16px;
    margin-left: 5px;
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      transform: translate3d(-50%, -50%, 0) rotate(-45deg);
      border: 2px solid #969799;
      border-left: none;
      border-top: none;
    }
  }
}
</style>
