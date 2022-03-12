<template>
  <el-dialog
    v-if="modal"
    id="container-modals"
    v-bind="bindDialog"
    v-on="onDialog" >
    <component
      :is="modal.component"
      :id="modal.id"
      v-bind="modal.componentAttrs"
      v-on="modal.componentListeners"
      @close="handleCloseModal(modal.id)" />
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import * as _modals from '@/store/view/Modals/mutations-types';

const ActionConfirmation = () => import(/* webpackChunkName: "ActionConfirmationModal" */ '@/components/modals/components/ActionConfirmation');
const MessageBox =  () => import(/* webpackChunkName: "MessageBoxModal" */ '@/components/modals/components/MessageBox');
const SuccessEditUserPassword =  () => import(/* webpackChunkName: "SuccessEditUserPasswordModal" */ '@/components/modals/components/SuccessEditUserPassword');

export default {
  name: "Modals",

  components: {
    ActionConfirmation,
    MessageBox,
    SuccessEditUserPassword,
  },

  data() {
    return {
      presettings: {
        ActionConfirmation: {
          width: '454px',
        },
        
        MessageBox: {
          width: '434px',
        },

        SuccessEditUserPassword: {
          width: '434px',
          'custom-class': 'modal-success-edit-user-password__el-dialog'
        }
      }
    }
  },

  computed: {
    ...mapState('Modals', [
      'modals',
    ]),

    /**
     * Текущее число модальных окон в стеке
     */
    countModals() {
      return this.modals.length;
    },

    /**
     * Данные текущего модального окна
     */
    modal() {
      return this.countModals ? this.modals[this.countModals - 1] : null;
    },

    /**
     * Переменные для el-dialog
     */
    bindDialog() {
      return this.modal
        ? {
          "custom-class": "iz-dialog",
          center: true,
          visible:  true,
          top: "0",
          ...this.presettings[this.modal.component],
          ...this.modal.modalAttrs,
        }
        : null;
    },

    /**
     * Emit события для el-dialog
     */
    onDialog() {
      return this.modal
        ? {
          close: this.handleCloseDialog,
          ...this.modal.modalListeners,
        }
        : null;
    }
  },

  watch: {
    /**
     * Если обновился route,
     * то принудительно очищаем массив отображаемых модальных окон.
     */
    '$route'(to, from) {
      if (to.path !== from.path && this.countModals > 0) {
        this[_modals.REMOVE_MODALS]();
      }
    },
  },

  methods: {
    ...mapMutations('Modals', [
      _modals.REMOVE_MODALS,
    ]),

    /**
     * Событие от el-dialog закрытия модального окна
     */
    handleCloseDialog() {
      if (this.modal) {
        this.handleCloseModal(this.modal.id);
      }
    },

    /**
     * Метод закрытия модального окна
     */
    handleCloseModal(id) {
      this[_modals.REMOVE_MODALS](id);
    },
  },
}
</script>

<style lang="scss">
.el-dialog__wrapper#container-modals {
  display: flex;
  justify-content: center;
  align-items: center;

  .iz-dialog {
    @include shadow-3();
    border-radius: 4px;
    &.el-dialog {
      margin: 0;
    }

    .el-dialog {
      &__header {
        padding: 0;
      }

      &__body {
        padding: 0px;
      }

      &__close:before {
        color: $dark-grey-1000;
      }

      &__headerbtn {
        top: 3rem;
        right: 3rem;
      }
    }
  }
}
</style>