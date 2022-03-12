<template>
  <el-drawer
    v-if="isOpen"
    visible
    size="820px"
    :before-close="checkCloseDrawer">

    <div class="drawers-administration-user">
      <!-- header -->
      <p class="font-lg">{{ getText.header }}</p>

      <!-- Выбор типа пользователя -->
      <el-row
        v-if="isCreateMode"
        class="drawers-administration-user__wrapper">
        <el-col>
          <el-radio-group v-model="value.from_ad">
            <!-- <el-radio-button :label="true">{{ $t('message.admin.users.drawers.userEditor.typeUserAdd.active') }}</el-radio-button> -->
            <el-radio-button :label="false">{{ $t('message.admin.users.drawers.userEditor.typeUserAdd.local') }}</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- Поле ввода логина -->
      <el-row class="drawers-administration-user__wrapper">
        <template v-if="isCreateMode">
          <el-col
            class="drawers-administration-user__login"
            :class="{ 'drawers-administration-user__login_error': errors.login }"
            :span="12">
            <p class="drawers-administration-user__subtitle font-sm iz-field_required">{{ $t('message.admin.users.drawers.userEditor.enterLogin') }}</p>
            <el-input
              class="drawers-administration-user__login__input"
              v-model="value.login"
              @input="updateErrors({ login: null })"
              @blur="validateLogin"
              :placeholder="$t('message.admin.users.drawers.userEditor.login')">
              <i
                v-if="errors.login"
                class="el-icon-warning el-input__icon"
                slot="suffix"/>
            </el-input>
            <div class="drawers-administration-user__login-desc font-xs">
              <span v-if="errors.login">{{ errors.login }}</span>
            </div>
          </el-col>
        </template>
        <template v-else>
          <el-col
            class="drawers-administration-user__login"
            :span="12">
            <p class="drawers-administration-user__subtitle font-sm">{{ $t('message.admin.users.drawers.userEditor.login') }}</p>
            <p class="font-sm">{{ value.login }}</p>
          </el-col>
        </template>
      </el-row>

      <!-- Поле ввода ФИО -->
      <el-row class="drawers-administration-user__wrapper">
        <el-col
          class="drawers-administration-user__full-name"
          :class="{ 'drawers-administration-user__full-name_error': errors.full_name }"
          :span="12">
          <p class="drawers-administration-user__subtitle font-sm iz-field_required">{{ $t('message.admin.users.drawers.userEditor.enterUserFullName') }}</p>
          <el-input
            class="drawers-administration-user__full-name__input"
            v-model="value.full_name"
            @input="updateErrors({ full_name: null })"
            :placeholder="$t('message.admin.users.drawers.userEditor.shortFullName')">
            <i
              v-if="errors.full_name"
              class="el-icon-warning el-input__icon"
              slot="suffix"/>
          </el-input>
          <div class="drawers-administration-user__full-name-desc font-xs">
            <span v-if="errors.full_name">{{ errors.full_name }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          v-if="!isCreateMode"
          class="drawers-administration-user__status"
          :span="12">
          <el-switch
            class="drawers-administration-user__status-switcher"
            v-model="value.is_active"
            :active-text="getStatusText(value.is_active)">
          </el-switch>
        </el-col>
      </el-row>


      <!-- Поле выбора роли -->
      <el-row class="drawers-administration-user__wrapper drawers-administration-user__roles">
        <el-col
          class="drawers-administration-user__roles__container"
          :span="24">
          <p class="drawers-administration-user__subtitle font-sm iz-field_required">{{ $t('message.admin.users.drawers.userEditor.selectRole') }}</p>
          <div class="drawers-administration-user__roles__groups">
            <el-radio-group 
              v-model="value.role_id"
              class="drawers-administration-user__roles__groups-container"
            >
              <el-radio
                class="drawers-administration-user__roles__groups-button"
                v-for="role in roles"
                :key="role.id"
                :label="role.id">{{ role.title }}</el-radio>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>

      
      <!-- Поле ввода пароля -->
      <el-row
        v-if="!value.from_ad"
        class="drawers-administration-user__wrapper">
        <template v-if="isCreateMode">
          <el-col
            class="drawers-administration-user__password"
            :class="{ 'drawers-administration-user__password_error': errors.password }"
            :span="12">
            <p class="drawers-administration-user__subtitle font-sm iz-field_required">{{ $t('message.admin.users.drawers.userEditor.enterPassword') }}</p>
            <el-input
              v-model="value.password"
              class="drawers-administration-user__password__input"
              type="password"
              :placeholder="$t('message.admin.users.drawers.userEditor.password')"
              show-password
              @keydown.native.space.prevent
              @paste.native.prevent="pastePassword"
              @input="updateErrors({ password: null })">
              <i
                v-if="errors.password"
                class="el-icon-warning el-input__icon"
                slot="suffix"/>
            </el-input>
            <div class="drawers-administration-user__password-desc font-xs">
              <span v-if="errors.password">{{ errors.password }}</span>
            </div>
          </el-col>
        </template>
        <template v-else>
          <el-col
            class="drawers-administration-user__password"
            :span="12">
            <p class="drawers-administration-user__subtitle font-sm">{{ $t('message.admin.users.drawers.userEditor.password') }}</p>
            <el-button
              class="drawers-administration-user__password-reset"
              type="text"
              icon="el-icon-close"
              @click="handleResetPassword">
              {{ $t('message.admin.users.drawers.userEditor.resetCurrentPassword') }}
            </el-button>
          </el-col>
        </template>

      </el-row>
      
      <!-- Кнопки управления -->
      <el-row class="drawers-administration-user__wrapper">
        <el-col :span="24">
          <IzButton
            class="drawers-administration-user__apply"
            :disabled="isDisabledApply"
            @click="handleApply"
            :loading="isPending"
            type="primary">
            {{ getText.applyButton }}
          </IzButton>
          <IzButton
            type="primary"
            plain
            :disabled="isDisabledReset"
            @click="resetUserData">
            {{ $t('message.common.buttons.resetChanges') }}
          </IzButton>
        </el-col>
      </el-row>
      
    </div>
  </el-drawer>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash-es';
import { mapMutations, mapActions, mapState } from 'vuex'

import { CREATE_MODAL } from "@/store/view/Modals/actions-types";

import IzButton from "@/components/IzElements/button";

const actionsEditor = [ 'create', 'edit' ];

export default {
  name: 'DrawersUsers',

  components: {
    IzButton,
  },

  inject: [
    'fetchUsers',
  ],

  data() {
    return {
      dataEditor: null,
      value: null,
      errors: {},
      isPending: false,
    }
  },

  computed: {
    ...mapState('Drawers', {
      userEditor: state => state.administration.userEditor,
    }),

    ...mapState('Authorization', {
      roles: state => state.roles,
      loadingRoles: state => !!state.loadings.roles,
    }),

    /**
     * Флаг отображения
     */
    isOpen() {
      return !!this.dataEditor && !this.loadingRoles;
    },

    isEqualData() {
      return this.isOpen ? isEqual(this.dataEditor.value, this.value) : true;
    },

    isCreateMode() {
      return this.dataEditor ? this.dataEditor.action === 'create' : false;
    },

    getText() {
      return this.isCreateMode
        ? {
          header: this.$t('message.admin.users.drawers.userEditor.addUser'),
          applyButton: this.$t('message.common.buttons.save'),
        }
        : {
          header: this.$t('message.admin.users.drawers.userEditor.editUserData'),
          applyButton: this.$t('message.common.buttons.saveChanges'),
        };
    },

    isFillRequired() {
      if (this.isCreateMode) {
        if (
          this.value.login.trim().length < 5 ||
          (!this.value.from_ad && this.value.password.trim().length < 5)
        ) return false;
      }
      
      if (
        !this.value.full_name.trim().length ||
        (this.value.role_id === null)
      ) return false;
      

      return true;
    },

    isDisabledApply() {
      return this.isPending ||
        !this.isFillRequired ||
        this.haveErrors ||
        this.isEqualData;
    },

    isDisabledReset() {
      return this.isEqualData;
    },

    haveErrors() {
      return Object.values(this.errors).some(value => value);
    },
  },

  watch: {
    userEditor: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.loadRoles().then(() => {
            this.dataEditor = this.normalizeData(newValue.data);
            this.value = cloneDeep(this.dataEditor.value);
          });
        } else {
          this.dataEditor = null;
          this.value =  null;
        }
      }
    },
  },

  methods: {
    ...mapMutations('Drawers', [
      "closeDrawer",
    ]),

    ...mapActions('Modals', [
      CREATE_MODAL,
    ]),

    ...mapActions('Administration/Users', [
      'addUserAction',
      'updateUserAction',
      'resetUserPasswordAction',
      'addNewUsers'
    ]),

    ...mapActions('Authorization', [
      'loadRoles',
    ]),

    /**
     * Нормализация данных
     */
    normalizeData(data = null) {
      if (!data) {
        return null;
      }

      const action = actionsEditor.includes(data.action) ? data.action : 'create';

      const result = {
        action,
        value: this.fillData(data.value, action),
      }
      return result;
    },

    /**
     * Инизиализация пустых значений
     */
    emptyData(action) {
      let result = {
        login: "",
        full_name: "",
        password: "",
        from_ad: false,

        role_id: this.roles.length ? this.roles[0].id : null,
      }

      if (action === 'edit') {
        result = {
          ...result,
          is_active: false,
        }
      }
      return result;
    },

    /**
     * Преообразование к валидным данным
     */
    fillData(data = null, action = 'create') {
      return {
        ...this.emptyData(action),
        ...data,
      };
    },

    
    /**
     * Обработка событие сокрытия drawer
     */
    handleCloseDrawer() {
      this.resetErrors();
      this.closeDrawer({ module: 'administration', drawer: 'userEditor' });
    },

    /**
     * Событие клика по кнопке применения
     */
    handleApply() {
      if (this.isCreateMode) {
        this.createUser();
      } else {
        this.handleUpdateUser();
      }
    },

    /**
     * Сброс текущих данных к испходным
     */
    resetUserData() {
      this.resetErrors();
      this.value = cloneDeep(this.dataEditor.value);
    },

    /**
     * Обработка возможности закрыть панель
     */
    checkCloseDrawer() {
      if (this.isEqualData && !this.isPending) {
        this.handleCloseDrawer();
      } else {
        this[CREATE_MODAL]({
          component: 'ActionConfirmation',
          componentAttrs: {
            type: 'danger',
            text: this.$t('message.admin.users.drawers.userEditor.cancelEdit.text'),
            description: this.$t('message.admin.users.drawers.userEditor.cancelEdit.info'),
            buttonCancel: {
              text: this.$t('message.common.buttons.cancel'),
            },
            buttonSuccess: {
              text: this.$t('message.common.buttons.exit'),
              action: (closeModal => {
                closeModal();
                this.handleCloseDrawer();
              }),
            },
          },
        });
      }
    },

    /**
     * Обновление словаря ошибок
     */
    updateErrors(data) {
      this.errors = { ...this.errors, ...data };
    },

    /**
     * Полный сброс всех ошибок
     */
    resetErrors() {
      this.errors = {};
    },

    getStatusText(status) {
      return status
        ? this.$t('message.admin.users.drawers.userEditor.status.active')
        : this.$t('message.admin.users.drawers.userEditor.status.inactive');
    },

    getCreateUserSendData(data) {
      const result = {
        login: data.login.trim(),
        full_name: data.full_name.trim(),
        from_ad: !!data.from_ad,
        
        role_id: data.role_id,
      };

      if (!data.from_ad) {
        result['password'] = data.password.trim();
      }

      return result;
    },

    createUser() {
      if (this.isPending) {
        return;
      }
      this.isPending = true;
      const sendData = this.getCreateUserSendData(this.value);
      this.addUserAction(sendData)
        .then(user => {
          this.handleCloseDrawer();
          this.fetchUsers({ ...this.$route.query, page: '1' });

          if (sendData.from_ad) {
            window.bslNotice({
              type: 'success',
              data: {
                message: this.$t('message.admin.users.notices.createUserSuccess').replace('{{name}}', user.full_name),
              }
            });
          } else {
            this[CREATE_MODAL]({
              component: 'SuccessEditUserPassword',
              componentAttrs: {
                data: sendData,
                text: this.$t('message.admin.users.modals.userSuccessAdded'),
                info: this.$t('message.admin.users.modals.provideDataForAuthorizationManager'),
                button: {
                  bind: {
                    type: 'primary',
                    plain: true,
                  },
                  text: this.$t('message.common.buttons.ok')
                },
              }
            });
          }

          this.addNewUsers([user.id]);
        })
        .catch(errors => {
          if (errors) {
            this.updateErrors(errors);
          } else {
            this[CREATE_MODAL]({
              component: 'MessageBox',
              componentAttrs: {
                icon: 'error',
                message: this.$t('message.common.modals.MessageBox.errorSavingData'),
                button: {
                  bind: {
                    type: 'primary',
                    plain: true,
                  },
                  text: this.$t('message.common.buttons.ok')
                },
              }
            });
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    },

    handleUpdateUser() {
      this[CREATE_MODAL]({
        component: 'ActionConfirmation',
        componentAttrs: {
          type: 'warning',
          text: this.$t('message.admin.users.drawers.userEditor.saveChanges.text'),
          description: this.$t('message.admin.users.drawers.userEditor.saveChanges.info'),
          buttonCancel: {
            text: this.$t('message.common.buttons.cancel'),
          },
          buttonSuccess: {
            text: this.$t('message.common.buttons.save'),
            action: (closeModal => {
              closeModal();
              this.updateRole();
            }),
          }
        },
      });
    },

    updateRole() {
      if (this.isPending) {
        return;
      }
      this.isPending = true;
      const sendData = {
        full_name: this.value.full_name.trim(),
        is_active: this.value.is_active,
        role_id: this.value.role_id,
      };

      this.updateUserAction({ id: this.value.id, data: sendData })
        .then(() => {
          this.handleCloseDrawer();
          this.fetchUsers({ ...this.$route.query, page: '1' });

          window.bslNotice({
            type: 'success',
            data: {
              message: this.$t('message.admin.users.notices.changesSavedSuccess'),
            }
          });
        })
        .catch(errors => {
          if (errors) {
            this.updateErrors(errors);
          } else {
            this[CREATE_MODAL]({
              component: 'MessageBox',
              componentAttrs: {
                icon: 'error',
                message: this.$t('message.common.modals.MessageBox.errorSavingData'),
                button: {
                  bind: {
                    type: 'primary',
                    plain: true,
                  },
                  text: this.$t('message.common.buttons.ok')
                },
              }
            });
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    },
    
    handleResetPassword() {
      this[CREATE_MODAL]({
        component: 'ActionConfirmation',
        componentAttrs: {
          type: 'warning',
          text: this.$t('message.admin.users.modals.resetPassword.youSureWantResetPassword'),
          description: this.$t('message.admin.users.modals.resetPassword.actionCannotRestored'),
          buttonCancel: {
            text: this.$t('message.common.buttons.cancel'),
          },
          buttonSuccess: {
            text: this.$t('message.admin.users.modals.resetPassword.reset'),
            action: (closeModal => {
              closeModal();
              this.resetUserPassword();
            }),
          }
        },
      });
    },

    resetUserPassword() {
      this.resetUserPasswordAction(this.value.id)
        .then(data => {
          this[CREATE_MODAL]({
            component: 'SuccessEditUserPassword',
            componentAttrs: {
              data,
              text: this.$t('message.admin.users.modals.resetPassword.succesReset'),
              info: this.$t('message.admin.users.modals.provideDataForAuthorizationManager'),
              button: {
                bind: {
                  type: 'primary',
                  plain: true,
                },
                text: this.$t('message.common.buttons.ok')
              },
            }
          });
        })
        .catch(() => {
          this[CREATE_MODAL]({
              component: 'MessageBox',
              componentAttrs: {
                icon: 'error',
                message: this.$t('message.admin.users.modals.resetPassword.errorReset'),
                button: {
                  bind: {
                    type: 'primary',
                    plain: true,
                  },
                  text: this.$t('message.common.buttons.ok')
                },
              }
            });
        })
    },

    validateLogin() {
      if (this.value.login.trim().length < 5) {
        this.updateErrors({ login: this.$t('message.common.errors.input.minLength').replace('{{number}}', 5) });
      }
    },

    /**
     * Очищаем поле пароля при вставке от символов разделителей
     */
    pastePassword(event) {
      var clipboardData = event.clipboardData || event.originalEvent.clipboardData || window.clipboardData;
      var pastedData = clipboardData.getData('text');
      const value = pastedData.split(/[\s\t\n]/ig).join('');
      
      if ('password' in this.value) {
        this.value.password = value;
      }
    }
  }
}
</script>

<style lang="scss">
.drawers-administration-user {
  padding-left: 4rem;
  padding-right: 4rem;

  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: calc(100% - 20px);
  height: 100%;
  overflow: hidden;

  &__wrapper {
    margin-top: 4rem;
  }

  &__subtitle {
    color: $dark-blue-1000;
    margin-bottom: 0.8rem;
  }

  .el-tabs__header {
    display: none;
  }

  &__checkbox {
    width: 100%;
  }

  &__checkbox:not(:last-child) {
    margin-bottom: 1.9rem;
  }

  &__apply.el-button { 
    padding: 8px 58.5px;
    line-height: 22px;

    &.is-disabled,
    &.is-disabled:hover {
      background-color: $dark-grey-200;
      border-color: $dark-grey-200;
    }
  }

  &__status {
    &-switcher {
      .el-switch__label,
      .el-switch__label.is-active {
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        color: $dark-grey-1000;
        user-select: none;
      }
    }
  }

  &__login,
  &__full-name,
  &__password {
    max-width: 50%;

    &-desc {
      font-weight: normal;
      height: 12px;
    }

    &_error {
      input {
        border: 1px solid $red-1000 !important;
      }

      .el-input__icon {
        color: $red-800; 
      }

      .drawers-administration-user__login-desc,
      .drawers-administration-user__full-name-desc,
      .drawers-administration-user__password-desc {
        color: $red-1000;
      }
    }

    .el-input__icon {
      height: 20px;
      width: 20px;
      font-size: 20px;
      margin-right: 5px;
    }
  }

  &__password-reset {
    &.el-button--text {
      color: $red-1000;
      padding: 0;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
      &:focus {
        color: $red-1000;
      }
      &:hover {
        color: lighten($red-1000, 5);
      }
      &:active {
        color: darken($red-1000, 10);
      }
    }
  }

  &__roles {
    overflow: hidden;
    display: flex;

    &__container {
      display: flex;
      flex-direction: column;
    }

    &__groups {
      margin-top: .8rem;
      overflow: auto;
      flex: 1;

      &-container {
        columns: 2;
      }
      &-button {
        width: calc(100% - 30px);
        height: 38px;
        padding: 7px;
        .el-radio__label {
          font-weight: normal;
          font-size: 14px;
          line-height: 20px;
          color: $dark-grey-800;
        }
        
        &.is-checked {
          border: 1px solid $light-blue-1000;
          border-radius: 4px;
          padding: 6px;
          &.el-radio {
            .el-radio__label {
              color: $dark-grey-800;
            }
          }
        }
      }
    }
  }
}
</style>