<template>
  <div class="i-cell-group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "ieach-cell-group"
};
</script>
<style lang="scss" scope>
.i-cell-group {
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
</style>
