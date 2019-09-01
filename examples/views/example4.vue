<template>
  <div class="page-example4"></div>
</template>

<script>
export default {
  name: 'page-example4',
  created () {
    this.$eventBus.$emit('toggle-v-ibar', true)
  },
  destroyed () {
    this.$eventBus.$emit('toggle-v-ibar', false)
  }
}
</script>
