<template>
  <Button
    class="iz-button"
    :class="{ 'iz-button_loading': loading }"
    v-bind="getBind"
    v-on="$listeners">
    <slot />
  </Button>
</template>

<script>
import { Button } from 'element-ui';

export default {
  name: 'IzButton',
  
  components: {
    Button,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    icon: {
      type: String,
      default: null,
    }
  },

  computed: {
    getBind() {
      return {
        ...this.$attrs,
        loading: this.loading,
        icon: this.icon ? `el-icon-${ this.icon }` : '',
      }
    }
  }
};
</script>

<style lang="scss">
.iz-button {
  &_loading {
    position: relative;
    i.el-icon-loading {
      position: absolute;
      display: inline-block;
      margin-left: -18px;
      top: calc(50% - 7px);
      & + span {
        margin-left: 0;
      }
    }
  }
}
</style>