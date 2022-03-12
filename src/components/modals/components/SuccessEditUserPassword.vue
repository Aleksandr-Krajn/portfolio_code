<template>
  <div class="modal-success-edit-user-password">
    <IzIcon 
      class="modal-success-edit-user-password__icon"
      name="success" />

    <p
      v-if="text"
      class="modal-success-edit-user-password__title">{{ text }}</p>

    <div class="modal-success-edit-user-password__content">
      <div class="modal-success-edit-user-password__content-left">
        <p>{{ $t('message.common.fields.login') }}: {{ data.login }}</p>
        <p>{{ $t('message.common.fields.password') }}: {{ data.password }}</p>
      </div>
      <div class="modal-success-edit-user-password__content-right">
        <el-button
          type="text"
          icon="el-icon-copy-document"
          @click="handleCopy"/>        
      </div>
    </div>
    <p
      v-if="info"
      class="modal-success-edit-user-password__info">{{ info }}</p>
    <div 
      v-if="button"
      class="modal-success-edit-user-password__buttons">
      <el-button 
        v-bind="button.bind"
        class="modal-success-edit-user-password__button"
        @click="handleButton">
        {{ button.text }}
      </el-button>
    </div>
  </div>
</template>

<script>
import IzIcon from "IzElements/icon";

export default {
  name: "SuccessEditUserPassword",

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
     * Данные отображения
     */
    data: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Текст окна
     */
    text: {
      type: String,
      default: null,
    },

    /**
     * Дополнительная информацияя
     */
    info: {
      type: String,
      default: null,
    },

    /**
     * Данные для кнопки
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
      isCopied: false,
    }
  },

  methods: {    
    /**
     * Закрытие модального окна
     */
    closeModal() {
      this.$emit('close');
    },

    /**
     * Скопировать данные формы в буфер обмены
     */
    handleCopy() {
      if (this.isCopied) return;
      const str = `login=${ this.data.login };\npassword=${ this.data.password };`;
      const el = document.createElement('textarea');

      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-100vw';
      document.body.appendChild(el);
      el.select();
      el.setSelectionRange(0, str.length);
      document.execCommand('copy');
      document.body.removeChild(el);
      
      this.isCopied = true;
      this.$message(this.$t('message.common.modals.SuccessEditUserPassword.copiedLoginAndPassword'));
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    },

    /**
     * Обработка события по клику на кнопку
     */
    handleButton() {
      if (this.action) {
        this.action(this.closeModal);
      } else {
        this.closeModal();
      }
    },
  }
}
</script>

<style lang="scss">
.modal-success-edit-user-password {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  color: $dark-grey-1000;
  
  &__el-dialog {
    .el-dialog__header {
      height: 0;
      padding: 0;
    }
    .el-dialog__headerbtn {
      top: 2.4rem;
      right: 2.4rem;
    }
    .el-dialog__body {
      padding: 0;
    }
  }

  &__icon {
    width: 40px;
    height: 40px;
    font-size: 40px;
    margin-top: 18px;
    margin-bottom: 14px;
    color: $green-800;
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }

  &__content {
    display: flex;
    flex-wrap: nowrap;
    margin-top: 14px;

    &-left {
      font-weight: bold;
      font-size: 14px;
      line-height: 22px;
    }
    &-right {
      margin-left: 20px;
      i {
        font-size: 24px
      }
    }
  }

  &__info {
    margin-top: 1.4rem;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    word-break: break-word;
    color: $dark-grey-1000;
    white-space: pre-wrap;
  }

  &__buttons {
    width: 100%;
    margin-top: 2.4rem;
    display: flex;
    justify-content: center;
  }

  &__button {
    width: 50%;
    min-width: 160px;
  }
}
</style>