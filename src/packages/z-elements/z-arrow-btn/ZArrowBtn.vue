<template>
  <div class="z-arrow-btn">
    <el-button
      type="primary"
      icon="el-icon-arrow-left"
      :disabled="disabled"
      plain
      circle />
    <p class="z-arrow-btn__text">
      <slot />
    </p>
  </div>
</template>

<script>
import './assets/style.scss';

export default {
  name: 'ZArrowBtn',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style lang="scss">
.z-arrow-btn {
  .el-button {
    &[disabled] {
      &,
      &:hover,
      &:active {
        background-color: transparent;
        border: 1px solid #D8D8D8;
        color: #D8D8D8;
      }
    }
  }
}
</style>