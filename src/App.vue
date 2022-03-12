<template>
  <el-container id="app">
    <VueExtendLayouts />
    <Modals />
  </el-container>
</template>

<script>
import VueExtendLayouts from 'vue-extend-layout'
import Modals from '@/components/modals';

export default {
  components: {
    VueExtendLayouts,
    Modals,
  }
}
</script>
