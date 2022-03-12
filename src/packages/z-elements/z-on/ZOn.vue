<template>
  <div class="z-on">
    <button
      @click="handleClick"
      class="z-on__check"
      :disabled="disabled"
      :class="{'z-on__check--checked' : value}"
    >
      <span class="z-on__circle" :class="{'z-on__circle--active': value}"></span>
    </button>

    <p class="z-on__label">
      <slot />
    </p>
  </div>
</template>

<script>
import './assets/style.scss';

export default {
  name: 'ZCheckbox',
  
  props: {
    on: {
      default: false,
      type: Boolean
    },
    disabled: [Boolean]
  },

  computed: {
    value: {
      get() {
        return this.on
      },
      set(val) {
        this.$emit('update:on', val)
      }
    }
  },

  methods: {
    handleClick() {
      this.value = !this.value
    }
  }
}
</script>