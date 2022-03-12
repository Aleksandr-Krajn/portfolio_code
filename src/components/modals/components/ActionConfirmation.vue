<template>
  <div class="modal-action-confirmation">
    <IzIcon
      v-if="getIcon"
      class="modal-action-confirmation__icon"
      :class="getIcon.class"
      :name="getIcon.name" />

    <p v-if="text" class="modal-action-confirmation__text">
      {{ text }}
    </p>

    <p v-if="description" class="modal-action-confirmation__desc">
      {{ description }}
    </p>

    <div class="modal-action-confirmation__buttons">
      <IzButton
        v-if="buttonSuccess"
        class="modal-action-confirmation__button"
        v-bind="getBindSuccess"
        @click="handleSuccess">
        {{ buttonSuccess.text }}
      </IzButton>

      <IzButton
        v-if="buttonCancel"
        class="modal-action-confirmation__button" 
        v-bind="getBindCancel"
        @click="handleCancel">
        {{ buttonCancel.text }}
      </IzButton>
    </div>
  </div>
</template>

<script>
import IzButton from '@/components/IzElements/button';
import IzIcon from '@/components/IzElements/icon';

export default {
  name: "ActionConfirmation",

  components: {
    IzButton,
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
     * Тип действия
     */
    type: {
      type: String,
      defult: null,
    },

    /**
     * Текст вопроса действия
     */
    text: {
      type: String,
      default: null,
    },

    /**
     * Дополнительное описание действия
     */
    description: {
      type: String,
      default: null,
    },
    
    /**
     * Настройка кнопки подтверждения
     */
    buttonSuccess: {
      type: Object,
      default: null,
    },

    /**
     * Настройка кнопки отмена
     */
    buttonCancel: {
      type: Object,
      default: null,
    },
    
    icon: {
      type: [Boolean, Object],
      default: true,
    },
  },

  data() {
    return {
      defaultType: 'info',
      typesData: {
        warning: {
          icon: {
            name: 'warning',
            class: 'modal-action-confirmation__icon_red',
          },
          successButtonBind: {
            type: 'primary',
          },
          cancelButtonBind: {
            type: 'primary', 
            plain: true,
          },
        },

        danger: {
          icon: {
            name: 'warning',
            class: 'modal-action-confirmation__icon_red',
          },
          successButtonBind: {
            type: 'danger',
          },
          cancelButtonBind: {
            type: 'primary', 
            plain: true,
          },
        },

        info: {
          successButtonBind: {
            type: 'primary', 
            plain: true,
          },
          cancelButtonBind: {
            type: 'primary', 
            plain: true,
          },
        }
      },
    };
  },

  computed: {
    types() {
      return Object.keys(this.typesData);
    },

    currentType() {
      return this.types.includes(this.type)
        ? this.type
        : this.defaultType;
    },

    currentDataType() {
      return this.typesData[this.currentType];
    },

    getIcon() {
      const currentDataIcon = { ...this.currentDataType.icon };
      const iconIsObject = typeof this.icon === 'object';
      let icon = null;

      if (this.icon) {
        const name = iconIsObject ? this.icon.name : null;
        const _class = iconIsObject ? this.icon.class : null;
        icon = {
          name: name || currentDataIcon.name,
          class: [_class, currentDataIcon.class].filter(o => !!o).join(' ')
        };
      }
      return icon;
    },

    getBindSuccess() {
      return this.buttonSuccess
        ? {
          ...this.currentDataType.successButtonBind,
          ...this.buttonSuccess.bind,
        }
        : this.currentDataType.successButtonBind;
    },

    getBindCancel() {
      return this.buttonCancel
        ? {
          ...this.currentDataType.cancelButtonBind,
          ...this.buttonCancel.bind,
        }
        : this.currentDataType.cancelButtonBind;
    }
  },

  methods: {
    /**
     * Событие клика на кнопку подтверждения действия
     */
    handleSuccess() {
      if (this.buttonSuccess && typeof this.buttonSuccess.action === 'function') {
        this.buttonSuccess.action(this.closeModal);
      }
    },

    /**
     * Событие клика на кнопку отмены действия
     */
    handleCancel() {
      if (this.buttonCancel && typeof this.buttonCancel.action === 'function') {
        this.buttonCancel.action(this.closeModal);
      } else {
        this.closeModal();
      }
    },
    
    /**
     * Закрытие модального окна
     */
    closeModal() {
      this.$emit('close');
    },
  }
}
</script>

<style lang="scss">
.modal-action-confirmation {
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

  &__text {
    margin-top: 1.2rem;
    font-size: 1.6rem;
    line-height: 2.3rem;
    font-weight: 700;
    text-align: center;
    word-break: break-word;
  }

  &__desc {
    font-size: 1.4rem;
    margin-top: 0.8rem;
    word-break: normal;
    text-align: center;
    white-space: pre-wrap;
  }

  &__buttons {
    width: 100%;
    margin-top: 2.4rem;
    display: flex;
    justify-content: center;
  }

  &__button {
    flex: 1;
    max-width: 250px;
  }
}
</style>