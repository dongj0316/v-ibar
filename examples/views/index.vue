<template>
  <div class="page-index">
    <div class="title">示例demo</div>
    <div>
      <c-cell to="/example1" title="示例1" value="基本使用"></c-cell>
      <c-cell to="/example2" title="示例2" value="固定高度"></c-cell>
      <c-cell to="/example3" title="示例3" value="搜索"></c-cell>
    </div>
    <div class="title">表单</div>
    <div>
      <c-cell to="/example4" title="联系人" placeholder="选择联系人" :value="contact"></c-cell>
    </div>

    <router-view/>
  </div>
</template>

<script>
import CCell from '../components/c-cell'

export default {
  name: 'page-index',
  components: {
    CCell
  },
  data () {
    return {
      contact: ''
    }
  },
  created () {
    this.$eventBus.$on('on-address-book-select', item => {
      this.contact = item.name
    })
  }
}
</script>

<style lang="less">
.page-index {
  .title {
    padding: 30px 15px 10px;
    font-size: 14px;
    color: #999;
  }
}
</style>
