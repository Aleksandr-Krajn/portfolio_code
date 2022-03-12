<template>
  <div class="z-input">
    <div v-if="type === 'password'" class="z-input__element-wrapper">
      
      <input
        class="z-input__element z-input__element--password"
        :class="[className, {'error': error1 || error2}]"
        :type="showPassword ? 'password' : 'text'"
        :disabled="disabled" 
        :placeholder="placeholder"
        :value="value"
        @input="onInput"
      >
      <img v-show="error2" class="z-input__icon-error" src="../../images/icons/notice.svg" alt="">

      <span 
        v-show="!error2" 
        class="z-input__password-button" 
        @click="showPassword = !showPassword"
      >
        <img v-if="showPassword" class="z-input__password-icon" src="../../images/icons/pass-hide.svg" alt="">
        <img v-else class="z-input__password-icon" src="../../images/icons/pass-show.svg" alt="">
      </span>
    </div>

    <div v-else-if="type === 'search'" class="z-input__element-wrapper">
      <img class="z-input__search-icon" src="../../images/icons/search.svg" alt="">
      
      <input
        class="z-input__element z-input__search"
        :class="[className, {'error': error1 || error2}]"
        :type="typeInput"
        :disabled="disabled" 
        :placeholder="placeholder"
        :value="value"
        @input="onInput"
      >
      <img v-show="error2" class="z-input__icon-error" src="../../images/icons/notice.svg" alt="">
   
   </div>

   <div v-else class="z-input__element-wrapper">
      
      <input
        class="z-input__element"
        :class="[className, {'error': error1 || error2}]"
        :type="typeInput"
        :disabled="disabled" 
        :placeholder="placeholder"
        :value="value"
        @input="onInput"
      >
      <img v-show="error2" class="z-input__icon-error" src="../../images/icons/notice.svg" alt="">
   
   </div>

    <p class="z-input__message-error" v-show="error1 || error2">{{ messageError }}</p>
  </div>
</template>

<script>
import './assets/style.scss'

export default {
  name: 'ZInput',

  props: {
    type: {
      default: 'text',
      type: String
    },
    placeholder: [String],
    disabled: [Boolean],
    className: [String],
    messageError: [String],
    error1: [Boolean],
    error2: [Boolean],
    value: {
      type: String,
      default: ''
    },
  },

  data () {
    return {
      showPassword: false
    }
  },

  computed: {
    typeInput() {
      let result = this.type;

      if(this.type === 'search') {
        result = 'text'
      }

      return result
    }
  },

  watch: {
    type: {
      immediate: true,
      handler(newValue) {
        if (newValue === 'password') {
          this.showPassword = true;
        }
      }
    }
  },

  methods: {
    onInput(e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>