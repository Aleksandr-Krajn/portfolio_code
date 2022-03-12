<template>
  <Input
    class="iz-input"
    ref="input"
    v-bind="attrs"
    v-on="listeners">
    <template
      v-for="(_, name) in $scopedSlots"
      v-slot:[name]>
      <slot
        :name="name" />
    </template>
  </Input>
</template>

<script>
import { Input } from 'element-ui';
import { debounce, isEqual } from 'lodash-es';

export default {
  name: "IzInput",

  components: {
    Input,
  },

  props: {
    /**
     * Передаваемое значение обязательно и не влияет на тип
     */
    value: {
      type: null,
      required: true,
    },

    /**
     * Время отложенного события изменения данных.
     * Если время равно 0, то задержки никакой нет.
     */
    debounce: {
      type: Number,
      default: 0,
    },

    isError: {
      type: Boolean,
      default: false,
    },

    idInput: {
      type: [String, Number],
      default: null
    }
  },

  data() {
    return {
      debouncedChangeValue: null,
      debouncedInputValue: null,
      localValue: undefined,
    }
  },

  computed: {
    attrs() {
      const classes = [
        this.$attrs.class,
        (this.isError ? 'iz-input_error' : '')
      ].filter(v => !!v).join(' ');

      return {
        ...this.$attrs,
        class: classes,
        value: this.localValue,
      }
    },

    listeners() {
      return {
        ...this.$listeners,
        input: event => this.handleComponentInputValue(event),
        change: event => this.handleComponentChangeValue(event),
      }
    },

    isDebounce() {
      return this.debounce > 0;
    }
  },

  watch: {
    debounce: {
      immediate: true,
      handler(newValue) {
        if (this.isDebounce) {
          this.debouncedInputValue = debounce(function (value) {
            this.inputValue(value);
          }, newValue);
          this.debouncedChangeValue = debounce(function (value) {
            this.changeValue(value);
          }, newValue);
        } else {
          this.debouncedInputValue = null;
          this.debouncedChangeValue = null;
        }
      }
    },

    idInput: {
      immediate: true,
      handler(newValue) {
        if (newValue !== null) {
          this.$nextTick(() => {
            const input = this.$refs.input.$el.querySelector('input');
            if (input) {
              input.setAttribute('id', newValue.toString());
            }
          });
        }
      }
    },

    value: {
      immediate: true,
      handler(newValue) {
        this.localValue = newValue;
      }
    }
  },

  methods: {
    /**
     * Вызов события @input
     */
    inputValue(value) {
      this.$emit('input', value);
    },

    /**
     * Вызов события @change
     */
    changeValue(value) {
      if (!isEqual(this.value, value)) {
        this.$emit('change', value);
      }
    },

    /**
     * Cобытие input в зависимости от флага debounced
     */
    handleComponentInputValue(value) {
      this.localValue = value;
      if (this.isDebounce && this.debouncedInputValue) {
        this.debouncedInputValue(value);
      } else {
        this.inputValue(value);
      }
    },

    /**
     * Событие change в зависимости от флага debounced
     */
    handleComponentChangeValue(value) {
      this.localValue = value;
      if (this.isDebounce && this.debouncedChangeValue) {
        this.debouncedChangeValue(value);
      } else {
        this.changeValue(value);
      }
    }
  }
}
</script>

<style lang="scss">
.iz-input {
  &_error:not(.is-disabled) {
    .el-input__suffix i {
      color: $red-800;
    }

    input,
    input:hover,
    input:active {
      border: 1px solid $red-1000;
    }
  }
}
</style>