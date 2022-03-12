<template>
  <div class="z-btn">
    <button
      :disabled="disabled"
      @click="$emit('hander-click')"
      class="z-btn__element"
      :class="[...className, ` z-btn__element--${type}`]
    ">
      <z-icon class="z-btn__icon" v-if="icon" :image="icon" />
      <slot />
    </button>
  </div>
</template>

<script>
import './assets/style.scss'

// trans
// opacity
export default {
  name: 'ZBtn',

  props: {
    className: {
      default: '',
      type: String,
    },
    type: {
      default: 'default',
      type: String
    },
    disabled: [Boolean],
    icon: [String]
  },
};
</script>
