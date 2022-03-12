<template>
  <div class="z-table-checkbox">
    <i v-if="!active && value" class="el-icon-check" />
    <el-checkbox v-else-if="active" v-model="value" />
  </div>
</template>

<script>
import './assets/style.scss';

export default {
  name: 'ZTableCheckbox',

  props: {
    active: [Boolean],
    value: [Boolean]
  }
}
</script>