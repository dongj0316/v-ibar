<template>
  <div class="page-example4"></div>
</template>

<script>
export default {
  name: 'page-example4',
  created () {
    this.$eventBus.$emit('toggle-address-book', true)
  },
  destroyed () {
    this.$eventBus.$emit('toggle-address-book', false)
  }
}
</script>
