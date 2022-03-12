<template>
  <div class="modal-message">
    <IzIcon
      v-if="getIcon"
      class="modal-message__icon"
      :name="getIcon.name"
      v-bind="getIcon.bind" />

    <p v-if="message" class="modal-message__message">
      {{ message }}
    </p>

    <div 
      v-if="button"
      class="modal-message__buttons">
      <el-button 
        v-bind="button.bind"
        class="modal-message__button"
        @click="handleButton">
        {{ button.text }}
      </el-button>
    </div>
  </div>
</template>

<script>
import IzIcon from 'IzElements/icon';

export default {
  name: "MessageBox",

  components: {
    IzIcon,
  },

  props: {
    /**
     * Идентификатор модального окна
     */
    id: {
      type: Symbol,
      required: true,
    },

    /**
     * Тип настроек иконки из iz-icon
     */
    icon: {
      type: [String, Object],
      default: null,
    },

    /**
     * Текст сообщения
     */
    message: {
      type: String,
      default: null,
    },
    
    /**
     * Текст кнопки, если она необходима
     */
    button: {
      type: null,
      default: null,
    },
    
    /**
     * Тригер по нажатию на кнопку
     */
    action: {
      type: Function,
      default: null,
    }
  },

  data() {
    return {
      presets: {
        error: {
          class: "modal-message__icon_red",
        }
      }
    };
  },

  computed: {
    getIcon() {
      let result = null;
      if (this.icon) {
        const isString = typeof this.icon === 'string';

        const _name = isString ? this.icon : this.icon.name;
        const _bind = isString ? {} : this.icon.bind;

        const _preset = this.presets[_name] || {};

        result = {
          name: _name,
          bind: {
            ..._preset,
            ..._bind,
          },
        }
      }
      return result;
    },
  },

  methods: {
    handleButton() {
      if (this.action) {
        this.action(this.closeModal);
      } else {
        this.closeModal();
      }
    },
    
    /**
     * Закрытие модального окна
     */
    closeModal() {
      this.$emit('close');
    }
  }
}
</script>

<style lang="scss">
.modal-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 5.4rem;
  &__icon {
    width: 40px;
    height: 40px;
    font-size: 40px;

    &_red {
      color: $red-800;
    }
  }

  &__message {
    margin-top: 1.2rem;
    font-size: 1.6rem;
    line-height: 2.3rem;
    font-weight: bold;
    text-align: center;
    word-break: break-word;
    color: $dark-grey-1000;
  }


  &__buttons {
    width: 100%;
    margin-top: 2.4rem;
    display: flex;
    justify-content: center;
  }

  &__button {
    width: 50%;
  }
}
</style>