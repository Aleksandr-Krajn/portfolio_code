<template>
  <el-table
    ref="table"
    :data="filteredRoles"
    class="table table-rights"
    :row-class-name="getRowClass"
    cell-class-name="table-rights__cell"
    header-row-class-name="table-rights__header-row"
    header-cell-class-name="table-rights__header-cell"
    style="width: 100%"
    @sort-change="handleChangeSort"
    :max-height="maxHeightTable">

    <!-- Колонка таблицы "Роль" -->
    <el-table-column
      prop="role_name"
      :label="$t('message.admin.rights.table.role')"
      sortable
      width="260"
      fixed>
      <el-table-column
        prop="role_name"
        width="260"
        :sort-method="sortRole">
        <!-- input фильтрации  -->
        <template #header >
          <IzInput
            class="table-roles__filter-role-name__input"
            v-model="filterData.role_name"
            :placeholder="$t('message.admin.rights.table.roleName')"
            :debounce="500"
            prefix-icon="el-icon-search"
            clearable
            @clear="handleChangeFilter({ role_name: undefined })"
            @change="handleChangeFilter({ role_name: $event || undefined })" />
        </template>
        
        <template #default="{ row }">
          <div class="table-rights__role">
            <span>{{ row.title }}</span>

            <div class="table-rights__role-control">
              <span class="table-rights__role-control-label">{{ $t('message.admin.rights.table.newRoleLabel') }}</span>
              <el-button
                class="table-rights__button-delete table-rights__button"
                type="text"
                icon="el-icon-delete"
                @click="showConfirmationRemoveRole(row)"/>

              <el-button
                class="table-rights__button"
                type="text"
                icon="el-icon-edit"
                @click="handleEditRole(row)"/>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table-column>

    <!-- Колонка таблицы  "Права" -->
    <el-table-column 
      prop="permissions"
      :label="$t('message.admin.rights.table.rights')">
      <el-table-column
        v-for="permission in permissions"
        :key="permission.id"
        :width="184">
        <template #header >
          <el-tooltip
            popper-class="table-rights__header-tooltip"
            effect="dark"
            placement="top"
            :content="permission.title">
            <span class="table-rights__header-field">{{ permission.title }}</span>
          </el-tooltip>
        </template>

        <template #default="{ row }">
          <div 
            v-if="row.permissionIDs.includes(permission.id)"
            class="z-table-checkbox">
            <i class="el-icon-check" />
          </div>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'

import { CREATE_MODAL } from "@/store/view/Modals/actions-types";

import IzInput from '@/components/IzElements/inputs/input';

export default {
  props: {
    propEditTable: [Boolean]
  },

  components: {
    IzInput,
  },

  inject: [
    'fetchRoles',
  ],

  data() {
    return {
      maxHeightTable: 400,

      filterData: {
        role_name: '',
      }
    }
  },

  computed: {
    ...mapState('Authorization', [
      'permissions',
    ]),

    ...mapState('Administration/Rights', [
      'roles',
      'newRoles',
    ]),

    ...mapGetters('Administration/Rights', [
      'routeQueryNormalize',
    ]),

    filteredRoles() {
      const roleName = (this.routeQueryNormalize.role_name || '').trim().toLowerCase();
      return this.roles.filter(role => {
        return role.title.toLowerCase().includes(roleName);
      });
    }
  },

  watch: {
    routeQueryNormalize: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.filterData = {
            role_name: newValue.role_name || '',
          };

          this.updateOrderingTable(newValue.ordering);
        }
      }
    }
  },

  mounted() {
    this.updateHeightTable();
    window.addEventListener("resize", this.updateHeightTable);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.updateHeightTable);
  },

  methods: {
    ...mapMutations('Drawers', [
      "openDrawer",
    ]),

    ...mapActions('Modals', [
      CREATE_MODAL,
    ]),

    ...mapActions('Administration/Rights', [
      'removeRoleAction',
    ]),

    getRowClass({ row }) {
      let _class = 'table-rights__rows';
      if (this.newRoles.includes(row.id)) {
        _class += ' table-rights__rows-new';
      }
      return _class;
    },

    handleChangeFilter(data) {
      this.fetchRoles({
        ...this.$route.query,
        ...data,
      });
    },

    sortRole(first, second) {
      const a = first.title;
      const b = second.title;

      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    },

    handleChangeSort({ order, prop }) {
      let value = undefined;

      if (order) {
        value = (order === "ascending")
          ? prop
          : `${ prop } desc`;
      }

      this.handleChangeFilter({ ordering: value });
    },

    updateOrderingTable(ordering) {
      const _updateTableStoreColumn = (table, fn) => {
        if (
          fn &&
          typeof fn === 'function' &&
          table &&
          table.store &&
          table.store.states &&
          table.store.states.originColumns
        ) {
          table.store.states.originColumns.forEach(column => {
            fn(column);
          });
          table.store.updateColumns();
        }
      };

      this.$nextTick(() => {
        if (this.$refs.table) {
          if (ordering) {
            const value = ordering.value ? "ascending" : "descending";
            this.$refs.table.sort(ordering.field, value);
            _updateTableStoreColumn(this.$refs.table, column => {
              column['order'] = (column.property === ordering.field)
                ? value
                : null;
            });
          } else {
            this.$refs.table.clearSort();
            _updateTableStoreColumn(this.$refs.table, column => {
              column['order'] = null;
            });
          }
        }
      });
    },

    updateHeightTable() {
      this.$nextTick(() => {
        const mainContainter = document.querySelector('.iz-default-layout__main');
        if (mainContainter) {
          const style = window.getComputedStyle(mainContainter);

          const heightMain = mainContainter.clientHeight -
            parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) -
            parseFloat(style.marginTop) - parseFloat(style.marginBottom);

          const heightOther = 145;

          this.maxHeightTable = heightMain - heightOther;
        }
      });
    },

    handleEditRole(role) {
      this.openDrawer({
        module: 'administration',
        drawer: 'roleEditor',
        data: {
          action: 'edit',
          value: {
            id: role.id,
            title: role.title,
            permission_ids: role.permissionIDs
          }
        },
      });
    },

    handleRemoveRole(role) {      
      this.removeRoleAction(role.id)
        .then(() => {
          this.fetchRoles(this.$route.query);
          window.bslNotice({
            type: 'success',
            data: {
              message: this.$t('message.admin.rights.notices.removeRoleSuccess').replace('{{name}}', role.title),
            }
          });
        })
        .catch(() => {
          this[CREATE_MODAL]({
            component: 'ActionConfirmation',
            modalAttrs: {
              width: '390px',
            },
            componentAttrs: {
              type: 'info',
              icon: false,
              text: this.$t('message.common.buttons.error'),
              description: this.$t('message.admin.rights.errorRemoveRole').replace('{{name}}', role.title),
              buttonSuccess: {
                text: this.$t('message.admin.rights.viewUsers'),
                action: (closeModal => {
                  closeModal();
                  this.$router.push({
                    path: '/administration/users',
                    query: { role_id: role.id }
                  });
                }),
              }
            },
          });
        })
    },

    showConfirmationRemoveRole(role) {
      if (!role) return;

      this[CREATE_MODAL]({
        component: 'ActionConfirmation',
        componentAttrs: {
          type: 'danger',
          text: this.$t('message.admin.rights.removeRole.text').replace("{{name}}", role.title),
          description: this.$t('message.admin.rights.removeRole.info'),
          buttonCancel: {
            text: this.$t('message.common.buttons.cancel'),
          },
          buttonSuccess: {
            text: this.$t('message.common.buttons.delete'),
            action: (closeModal => {
              closeModal();
              this.handleRemoveRole(role);
            }),
            bind: {
              icon: 'delete',
            }
          }
        },
      });
    }
  },
}
</script>

<style lang="scss">
.table-rights__header-tooltip.el-tooltip__popper {
  max-width: 250px;
  text-align: center;
}

.table-rights {
  &.el-table {
    border: none;
    
    th, td {
      border: none;
      &.el-table__cell.table-rights__cell {
        border-bottom: 1px solid $dark-grey-100;
      }
    }

    &::after,
    &::before {
      height: 0;
      width:  0;
    }
    
    table {
      min-width: 100%;
    }

    thead.is-group {
      th.el-table__cell {
        background: $white;
        border-right: 0;
        color: $black;
      }
    }

    .el-table__body-wrapper ~ .el-table__fixed {
      @include shadow-1();
    }

    .table-rights {
      &__header {
        &-row {
          th {
            border: none;
            padding: 13px 0;
          }
          th:first-child.table-rights__header-cell .cell {
            color: rgba($black, .85);
            padding: 0 18px;
          }
          &:last-child {
            th:not(:first-child) {
              background-color: $light-grey-50;
            }
          }
          &:not(:first-child) {
            .table-rights__header-cell {
              border-bottom: 1px solid $dark-grey-100;
              .cell {
                font-weight: normal;
                font-size: 14px;
                line-height: 20px;
              }
            }
          }
        }

        &-cell {
          .cell {
            font-weight: 500;
            font-size: 16px;
            line-height: 22px;
            color: $dark-blue;
            padding: 0 13px;
          }
        }

        &-field {
          max-width: 100%;
          height: 40px;
          max-height: 40px;
          display: block;
          display: -webkit-box;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      &__rows {
        .el-table__cell:nth-child(2n) {
          background-color: $light-grey-50;
        }
        &.hover-row {
          .el-table__cell {
            background-color: rgba($light-blue-100, .4);
          }
        }
        &-new {
          &.el-table__row {
            .el-table__cell {
              background-color: $green-100;
            }
          }
          &.hover-row {
            .el-table__cell {
              background-color: darken($green-100, 2);
            }
            .table-rights__role-control {
              .table-rights__role-control-label {
                display: none;
              }
            }
          }
          .table-rights__role-control {
            .table-rights__role-control-label {
              display: block;
            }
          }
        }
        .el-table__cell:first-child {
          .cell {
            padding: 0 15px;
          }
        }
      }
    }

    .cell {
      word-break: break-word;
    }
  }
  .el-table__body {
    overflow: auto;
  }

  &__rows &__cell {
    border-right: none;
    background: $white;
  }

  &__rows:hover &__role-control,
  &__rows.hover-row &__role-control {
    .el-button {
      display: inline-block
    }
    .table-rights__role-control-label {
      display: none;
    }
  }

  &__role {
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: $dark-blue;
    position: relative;
    padding-right: 7rem;
    
    &-control {
      position: absolute;
      right: 0.4rem;
      top: 50%;
      margin-top: -0.9rem;
      font-size: 1.8rem;
      line-height: 1;
      width: 60px;

      &-label {
        position: absolute;
        right: 10px;
        font-weight: normal;
        font-size: 12px;
        line-height: 18px;
        color: $white;
        background-color: $red-800;
        border-radius: 24px;
        padding: 1px 6.5px;
        display: none;
        text-transform: lowercase;
      }
      
      .table-rights__button {
        display: none;
        height: 20px;
        width: 20px;
        padding: 0;
        margin: 0 0 0 8px;
        & + .el-button {
          margin-left: 8px;
        }
        .el-icon-edit,
        .el-icon-delete {
          color: $dark-grey-1000;
          font-size: 16px;
        }
        &:hover {
          opacity: .7;
        }
        &:active {
          background-color: $dark-grey-100;
        }
        &-delete {
          &:hover {
            opacity: 1;
            i {
              color: $red-800;
            }
          }
        }
      }
    }
  }
}
</style>