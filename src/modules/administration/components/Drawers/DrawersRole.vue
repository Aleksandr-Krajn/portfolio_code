<template>
  <el-drawer
    v-if="isOpen"
    size="820px"
    visible
    :before-close="checkCloseDrawer">

    <div class="drawers-administration-role">
      <p class="font-lg">{{ getText.header }}</p>

      <el-row class="drawers-administration-role__wrapper">
        <el-col
          class="drawers-administration-role__role-name"
          :class="{ 'drawers-administration-role__role-name_error': errors.title }"
          :span="10">
          <p class="drawers-administration-role__subtitle font-sm iz-field_required">{{ $t('message.admin.rights.drawers.roleEditor.enterRoleName') }}</p>
          <el-input 
            class="drawers-administration-role__role-name__input"
            v-model="value.title"
            @input="updateErrors({ title: null })"
            :placeholder="$t('message.admin.rights.drawers.roleEditor.roleName')">
            <i
              v-if="errors.title"
              class="el-icon-warning el-input__icon"
              slot="suffix"/>
          </el-input>
          <div class="drawers-administration-role__role-name-desc font-xs">
            <span v-if="errors.title">{{ errors.title }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row class="drawers-administration-role__wrapper_half drawers-administration-role__permissions">
        <el-col
          class="drawers-administration-role__permissions__container"
          :span="24">
          <p class="drawers-administration-role__subtitle font-sm iz-field_required">{{ $t('message.admin.rights.drawers.roleEditor.selectRoleRights') }}</p>
          
          <!-- Кнопки групп пермишенов для роли -->
          <el-radio-group 
            v-model="currentTab"
            class="drawers-administration-role__permissions__groups">
            <el-radio-button
              v-for="group in permissionGroups"
              class="drawers-administration-role__permissions__groups-button font-sm"
              :key="group.id"
              :label="group.id">
              {{ group.title }}
            </el-radio-button>
          </el-radio-group>

          <!-- Блок списка пермишенов зависящих от выбранной группы пермишенов -->
          <el-tabs
            class="drawers-administration-role__permissions__tabs"
            :value="currentTab.toString()" >
            <el-tab-pane
              v-for="group in permissionGroups" 
              :key="group.id"
              :name="group.id.toString()">
                <template v-if="group.permissions">
                  <IzCheckbox
                    v-if="(group.permissions.length > 1) && mapAllChecked[group.id]"
                    class="drawers-administration-role__permissions__checkbox-all"
                    :indeterminate="mapAllChecked[group.id].indeterminate"
                    :value="mapAllChecked[group.id].all"
                    @change="handleChangeAllGroupPermissions(group.id, $event)">
                    {{ $t('message.common.fields.selectedAll') }}
                  </IzCheckbox>
                  <el-checkbox-group
                    v-if="group.permissions"
                    class="drawers-administration-role__permissions__checkbox-group"
                    :class="{
                      'drawers-administration-role__permissions__checkbox-group--columns' : isMultiColons(group.permissions),
                      'drawers-administration-role__permissions__checkbox-group_padding': group.permissions.length > 1,
                    }"
                    v-model="value.permission_ids">
                    <IzCheckbox
                      v-for="permission in group.permissions"
                      class="drawers-administration-role__permissions__checkbox"
                      :key="permission.id"
                      :label="permission.id">
                      {{ permission.title }}
                    </IzCheckbox>
                  </el-checkbox-group>
                </template>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      
      <!-- Кнопки управления данными -->
      <el-row class="drawers-administration-role__wrapper">
        <el-col :span="24">
          <IzButton
            class="drawers-administration-role__save"
            :disabled="isDisabledApply"
            type="primary"
            :loading="isPending"
            @click="handleApply">
            {{ getText.applyButton }}
          </IzButton>
          <IzButton
            type="primary"
            :disabled="isDisabledReset"
            plain
            @click="resetRoleData">
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

import IzCheckbox from "@/components/IzElements/checkbox";
import IzButton from "@/components/IzElements/button";

const actionsEditor = [ 'create', 'edit' ];

export default {
  name: 'DrawersRole',

  inject: [
    'fetchRoles',
  ],

  components: {
    IzCheckbox,
    IzButton,
  },

  data() {
    return {
      currentTab: null,
      dataEditor: null,
      value: null,
      errors: {},
      isPending: false,
    }
  },

  computed: {
    ...mapState('Drawers', {
      roleEditor: state => state.administration.roleEditor,
    }),

    ...mapState('Administration/Rights', [
      'permissionGroups',
    ]),

    mapPermissionGroupsIDs() {
      return this.permissionGroups.reduce((acc, group) => {
        acc[group.id] = group.permissions ? group.permissions.map(({ id }) => id) : [];
        return acc;
      }, {});
    },

    mapAllChecked() {
      return this.value
        ? this.permissionGroups.reduce((acc, group) => {
            const inGroupCount = this.mapPermissionGroupsIDs[group.id].filter(id => this.value.permission_ids.includes(id)).length;
            const isAllGroup = this.mapPermissionGroupsIDs[group.id].length === inGroupCount;
            acc[group.id] = {
              indeterminate: inGroupCount > 0 && !isAllGroup,
              all: isAllGroup,
            }
            return acc;
          }, {})
        : {};
    },

    /**
     * Флаг отображения
     */
    isOpen() {
      return Boolean(this.dataEditor);
    },

    /**
     * Флаг эквивалентности изменяемых данных с изначальными
     */
    isEqualData() {
      return this.isOpen ? isEqual(this.dataEditor.value, this.value) : true;
    },

    /**
     * Флаг типа редактирования роли "create"|"edit"
     */
    isCreateRole() {
      return this.dataEditor ? this.dataEditor.action === 'create' : false;
    },

    /**
     * Получение фраз в зависимости от типа редактирования
     */
    getText() {
      return this.isCreateRole
        ? {
          header: this.$t('message.admin.rights.drawers.roleEditor.addRole'),
          applyButton: this.$t('message.common.buttons.save'),
        }
        : {
          header: this.$t('message.admin.rights.drawers.roleEditor.editRole'),
          applyButton: this.$t('message.common.buttons.saveChanges'),
        };
    },

    isFillRequired() {
      return !!(
        this.value &&
        this.value.title.trim() &&
        this.value.permission_ids.length
      );
    },

    /**
     * Флаг блокировки дейсвтия подтверждения
     */
    isDisabledApply() {
      return this.isPending || 
        !this.isFillRequired ||
        this.haveErrors ||
        this.isEqualData;
    },

    /**
     * Флаг блокировки действия отмены
     */
    isDisabledReset() {
      return this.isEqualData;
    },

    /**
     * Флаг наличия ошибок в заполняемых данных
     */
    haveErrors() {
      return Object.values(this.errors).some(value => value);
    }
  },

  watch: {
    roleEditor: {
      immediate: true,
      handler(newValue) {
        this.resetCurrentTab(this.permissionGroups);

        if (newValue) {
          this.dataEditor = this.normalizeData(newValue.data);
          this.value = cloneDeep(this.dataEditor.value);
        } else {
          this.dataEditor = null;
          this.value =  null;
        }
      }
    },

    permissionGroups(newValue) {
      this.resetCurrentTab(newValue);
    },
  },

  methods: {
    ...mapMutations('Drawers', [
      "closeDrawer",
    ]),

    ...mapActions('Modals', [
      CREATE_MODAL,
    ]),

    ...mapActions('Administration/Rights', [
      'addRoleAction',
      'updateRoleAction',
      'addNewRoles',
    ]),

    ...mapActions('Authorization', [
      'loadRoles',
    ]),

    /**
     * Метод вычисления свойства мультиколонн для списка пермишенов
     */
    isMultiColons(permissions) {
      return permissions.length > 10;
    },

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
        value: this.fillData(data.value),
      }
      return result;
    },

    /**
     * Инизиализация пустых значений
     */
    emptyData() {
      return {
        title: '',
        permission_ids: [],
      };
    },

    /**
     * Преообразование к валидным данным
     */
    fillData(data = null) {
      return {
        ...this.emptyData(),
        ...data,
      };
    },

    /**
     * Обработка событие сокрытия drawer
     */
    handleCloseDrawer() {
      this.resetErrors();
      this.closeDrawer({ module: 'administration', drawer: 'roleEditor' });
    },

    /**
     * Событие клика по кнопке применения
     */
    handleApply() {
      if (this.isCreateRole) {
        this.createRole();
      } else {
        this.handleUpdateRole();
      }
    },

    /**
     * Добавление роли
     */
    createRole() {
      if (this.isPending) {
        return;
      }
      this.isPending = true;
      const sendData = {
        title: this.value.title.trim(),
        permission_ids: this.value.permission_ids,
      };
      this.addRoleAction(sendData)
        .then(data => {
          this.handleCloseDrawer();
          this.fetchRoles(this.$route.query);
          this.loadRoles();
          window.bslNotice({
            type: 'success',
            data: {
              message: this.$t('message.admin.rights.notices.createRoleSuccess').replace('{{name}}', data.title),
            }
          });
          this.addNewRoles([data.id]);
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

    handleUpdateRole() {
      this[CREATE_MODAL]({
        component: 'ActionConfirmation',
        componentAttrs: {
          type: 'warning',
          text: this.$t('message.admin.rights.drawers.roleEditor.saveChanges.text'),
          description: this.$t('message.admin.rights.drawers.roleEditor.saveChanges.info'),
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


    /**
     * Обновление роли
     */
    updateRole() {
      if (this.isPending) {
        return;
      }
      this.isPending = true;
      const sendData = {
        title: this.value.title.trim(),
        permission_ids: this.value.permission_ids,
      };
      this.updateRoleAction({id: this.value.id, data: sendData })
        .then(data => {
          this.handleCloseDrawer();
          this.fetchRoles(this.$route.query);
          this.loadRoles();

          window.bslNotice({
            type: 'success',
            data: {
              message: this.$t('message.admin.rights.notices.changeRoleSuccess').replace('{{name}}', data.title),
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

    /**
     * Сброс текущих данных к испходным
     */
    resetRoleData() {
      this.resetErrors();
      this.value = cloneDeep(this.dataEditor.value);
    },

    /**
     * Сброс текущей открытой вкладки прав роли к изначальному
     * @param {Array} tabs список вкладок
     */
    resetCurrentTab(tabs) {
      if (tabs && tabs.length) {
        this.currentTab = tabs[0].id;
      }
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
            text: this.$t('message.admin.rights.drawers.roleEditor.cancelEdit.text'),
            description: this.$t('message.admin.rights.drawers.roleEditor.cancelEdit.info'),
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

    handleChangeAllGroupPermissions(group, value) {
      const _set = new Set(this.value.permission_ids);
      if (this.mapPermissionGroupsIDs[group]) {
        const action = value ? 'add': 'delete';
        this.mapPermissionGroupsIDs[group].forEach(id => _set[action](id));
      }
      this.value.permission_ids = [..._set];
    }
  }
}
</script>

<style lang="scss">
.drawers-administration-role {
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
    &_half {
      margin-top: 2rem;
    }
  }

  &__subtitle {
    color: $dark-blue-1000;
    margin-bottom: 0.8rem;
  }

  .el-tabs__header {
    display: none;
  }

  &__role-name {
    max-width: 300px;

    &-desc {
      font-weight: normal;
      height: 12px;
    }

    &_error {
      input {
        border: 1px solid $red-1000 !important;
      }

      .drawers-administration-role__role-name-desc {
        color: $red-1000;
      }
    }

    .el-input__icon {
      height: 20px;
      width: 20px;
      font-size: 20px;
      margin-right: 5px;
      color: $red-800;
    }
  }
  
  &__save.el-button { 
    padding: 8px 58.5px;
    line-height: 22px;

    &.is-disabled,
    &.is-disabled:hover {
      background-color: $dark-grey-200;
      border-color: $dark-grey-200;
    }
  }

  &__permissions {
    overflow: hidden;
    display: flex;

    &__container {
      display: flex;
      flex-direction: column;
    }

    &__groups {
      &-button {
        .el-radio-button__inner {
          padding: 9px 16px;
          line-height: 20px;
          border: 1px solid $dark-grey-200;
          background-color: $white;
          margin-right: -1px;
          font-weight: normal;
          font-size: 14px;
          line-height: 20px;
        }
        &-button:checked + .el-radio-button__inner {
          background-color: $light-blue-1000;
        }
      }
    }

    &__checkbox-group {
      &--columns {
        columns: 2;
      }

      &_padding {
        padding: 24px 0 0 40px;
      }
    }

    &__checkbox {
      &.el-checkbox {
        width: calc(100% - 2rem);
        margin: 0 1rem 1.6rem 0;

        .el-checkbox__label {
          white-space: normal;
          word-break: break-word;
          font-weight: normal;
          font-size: 14px;
          line-height: 20px;
        }

        .el-checkbox__input {
          vertical-align: top;
          margin-top: 2px;
        }

        &:last-child {
          margin-bottom: 0rem;
        }
      }

      &-all.el-checkbox {
        .el-checkbox__label {
          white-space: normal;
          word-break: break-word;
          font-weight: normal;
          font-size: 14px;
          line-height: 20px;
        }

        .el-checkbox__input {
          vertical-align: top;
          margin-top: 2px;
        }
      }
    }

    &__tabs {
      margin-top: 2.5rem;
      overflow: auto;
      flex: 1;
    }
  }
}
</style>