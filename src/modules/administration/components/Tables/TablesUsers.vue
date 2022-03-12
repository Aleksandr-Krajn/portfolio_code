<template>
  <el-table
    ref="table"
    :data="users"
    class="table table-users"
    :row-class-name="getRowClass"
    cell-class-name="table-users__cell"
    header-row-class-name="table-users__header-rows"
    header-cell-class-name="table-users__header-cell"
    style="width: 100%"
    @sort-change="handleChangeSort"
    :max-height="maxHeightTable">

    <!-- Идентификатор пользователя -->
    <el-table-column
      prop="id"
      :label="$t('message.admin.users.tables.users.header.id')"
      sortable="custom"
      width="115"
      type="text">
      <el-table-column
        prop="id"
        width="115"
      >
        <!-- поле ввода идентификатора пользовател  -->
        <template #header >
          <IzInput
            v-model="filterData.id"
            placeholder="№"
            :debounce="500"
            clearable
            prefix-icon="el-icon-search"
            @input="handleChangeFilter({ id: $event || undefined })" />
        </template>
      </el-table-column>
    </el-table-column>

    <!-- Статус пользователя -->
    <el-table-column
      prop="is_active"
      :label="$t('message.admin.users.tables.users.header.status')"
      width="150"
      type="text">
      <el-table-column
        prop="is_active"
        width="150"
      >
        <!-- поле выбора статуса пользователя  -->
        <template #header >
          <el-select
            class="table-users__filter-status"
            v-model="filterData.is_active"
            :placeholder="$t('message.admin.users.tables.users.header.status')"
            clearable
            @change="handleChangeSelectFilter('is_active', $event)">
            <el-option 
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </template>
        <template #default="{ row }">
          <div
            class="table-users__filter-status-indicator"
            :class="{ 'table-users__filter-status-indicator_active': !!row.is_active }" />
        </template>
      </el-table-column>
    </el-table-column>

    <!-- Полное имя пользователя -->
    <el-table-column
      prop="full_name"
      :label="$t('message.admin.users.tables.users.header.fullName')"
      width="385"
      type="text"
      sortable="custom">
      <el-table-column
        prop="full_name"
        width="385"
      >
        <!-- поле ввода имени пользователя  -->
        <template #header >
          <IzInput
            class="table-users__filter-full-name__input"
            v-model="filterData.full_name"
            :debounce="500"
            clearable
            prefix-icon="el-icon-search"
            :placeholder="$t('message.admin.users.tables.users.header.fullName')"
            @input="handleChangeFilter({ full_name: $event || undefined })" />
        </template>
        <template #default="{ row }">
          <span class="table-users__full-name">{{ row.full_name }}</span>
        </template>
      </el-table-column>
    </el-table-column>

    <!-- Роль пользователя -->
    <el-table-column
      prop="role_id"
      :label="$t('message.admin.users.tables.users.header.role')"
      width="280"
      type="text">
      <el-table-column
        prop="role_id"
        width="280"
      >
        <!-- поле выбора роли пользователя  -->
        <template #header >
          <el-select
            class="table-users__filter-roles"
            v-model="filterData.role_id"
            :placeholder="$t('message.admin.users.tables.users.header.role')"
            clearable
            @change="handleChangeSelectFilter('role_id', $event)">
            <el-option 
              v-for="role in roles"
              :key="role.id"
              :label="role.title"
              :value="role.id"/>
          </el-select>
        </template>
        <template #default="{ row }">
          <span>{{ getNameRole(row.role_id) }}</span>
        </template>
      </el-table-column>
    </el-table-column>

    <!-- Логин пользователя -->
    <el-table-column
      prop="login"
      :label="$t('message.admin.users.tables.users.header.login')"
      width="275"
      type="text"
      sortable="custom">
      <el-table-column
        prop="login"
        width="275"
      >
        <!-- поле ввода логина -->
        <template #header >
          <IzInput
            class="table-users__filter-login"
            v-model="filterData.login"
            :debounce="500"
            clearable
            prefix-icon="el-icon-search"
            :placeholder="$t('message.admin.users.tables.users.header.login')"
            @input="handleChangeFilter({ login: $event || undefined })" />
        </template>
      </el-table-column>
    </el-table-column>

     <!-- Логин пользователя -->
    <el-table-column
      prop="created_at"
      :label="$t('message.admin.users.tables.users.header.createdDate')"
      width="270"
      type="text"
      sortable="custom">
      <el-table-column
        prop="created_at"
        width="270"
      >
        <!-- поле ввода имени пользователя  -->
        <template #header >
          <el-date-picker
            class="table-users__filter-date"
            v-mask.date="{ placeholder: $t('message.common.mask.date') }"
            v-model="filterData.date"
            type="daterange"
            range-separator="-"
            :start-placeholder="$t('message.common.fields.start')"
            :end-placeholder="$t('message.common.fields.end')"
            @change="handleChangeFilterDate"
            format="dd.MM.yyyy">
          </el-date-picker>
        </template>
        <template #default="{ row }">
          <div>{{ getDateFormat(row.created_at) }}</div>
        </template>
      </el-table-column>
    </el-table-column>

    <!-- Место добавления -->
    <el-table-column
      prop="from_ad"
      :label="$t('message.admin.users.tables.users.header.addPlace')"
      width="200"
      type="text">
      <el-table-column
        prop="from_ad"
        width="200"
      >
        <!-- поле выбора места добавления  -->
        <template #header >
          <el-select
            class="table-users__filter-add-place"
            v-model="filterData.from_ad"
            :placeholder="$t('message.common.fields.place')"
            clearable
            @change="handleChangeSelectFilter('from_ad', $event)">
            <el-option 
              v-for="item in addPlaceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </template>
        <template #default="{ row }">
          <span>{{ addPlaces[row.from_ad] }}</span>
        </template>
      </el-table-column>
    </el-table-column>

    <el-table-column 
      width="45"
      fixed="right"
      class="table-users__buttons">
      <template #default="{ row }">
        <el-button
          v-if="!row.from_ad"
          class="table-users__buttons-edit"
          type="text"
          icon="el-icon-edit"
          @click="handleEditUser(row)"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { format } from 'date-fns';

import { Mask } from '@/directives/mask';

import IzInput from '@/components/IzElements/inputs/input';

export default {
  name: "TablesUsers",

  components: {
    IzInput,
  },

  directives: {
    'mask': Mask,
  },

  inject: [
    'fetchUsers',
  ],

  data() {
    return {
      maxHeightTable: 400,
      /**
       * Данные фильтрации
       */
      filterData: {
        id: '',
        is_active: '',
        from_ad: '',
        full_name: '',
        login: '',
        date: [],
        role_id: '',
      },

      addPlaces: {
        true: this.$t('message.common.fields.activeDirectory'),
        false: this.$t('message.common.fields.locally'),
      },

      addPlaceOptions: [
        {
          value: true,
          label: this.$t('message.common.fields.activeDirectory'),
        },
        {
          value: false,
          label: this.$t('message.common.fields.locally'),
        },
      ],

      statusOptions: [
        {
          value: true,
          label: this.$t('message.common.fields.active'),
        },
        {
          value: false,
          label: this.$t('message.common.fields.inactive'),
        },
      ]
    }
  },

  computed: {
    ...mapState('Administration/Users', [
      'users',
      'newUsers',
    ]),

    ...mapState('Authorization', [
      'roles',
    ]),

    ...mapGetters('Administration/Users', [
      'routeQueryNormalize',
    ]),

    ...mapGetters('Authorization', [
      'mapRoles',
    ]),
  },

  watch: {
    routeQueryNormalize: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.filterData = {
            id: newValue.id || '',
            full_name: newValue.full_name || '',
            login: newValue.login || '',
            is_active: newValue.is_active !== undefined ? newValue.is_active : '',
            from_ad: newValue.from_ad !== undefined ? newValue.from_ad : '',
            date: (newValue.date_from && newValue.date_to) ? [newValue.date_from, newValue.date_to] : [],
            role_id: newValue.role_id || '',
          }
          
          this.updateOrderingTable(newValue.ordering);
        }
      }
    },
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

    getRowClass({ row }) {
      let _class = 'table-users__rows';
      if (this.newUsers.includes(row.id)) {
        _class += ' table-users__rows-new';
      }
      return _class;
    },

    handleChangeFilter(data) {
      this.fetchUsers({
        ...this.$route.query,
        ...data,
        page: '1',
      });
    },

    handleChangeSelectFilter(name, value) {
      this.handleChangeFilter({ [name]: value !== "" ? value : undefined });
    },

    /**
     * Обработка изменения данных
     */
    handleChangeFilterDate(date) {
      const isFill = date && date.length === 2 && date.every(d => typeof d === 'object');

      this.handleChangeFilter({
        date_from: isFill ? date[0].toISOString() : undefined,
        date_to: isFill ? date[1].toISOString() : undefined,
      });
    },

    /**
     * Возвращает строку вида d[d].m[m].yyyy
     */
    getDateFormat(str) {
      return format(new Date(str), 'dd.MM.yyyy');
    },

    /**
     * Поле имени роли
     */
    getNameRole(role_id) {
      return this.mapRoles.has(role_id) ? this.mapRoles.get(role_id).title : undefined;
    },

    handleEditUser(data) {
      this.openDrawer({
        module: 'administration',
        drawer: 'userEditor',
        data: { action: 'edit', value: data },
      });
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
            _updateTableStoreColumn(this.$refs.table, column => {
              column['order'] = (column.property === ordering.field)
                ? value
                : null;
            });
          } else {
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
  },
}
</script>

<style lang="scss">
.table-users {
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

    .table-users {
      &__cell .cell {
        word-break: break-word;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
      }

      &__full-name {
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
      }

      &__header {
        &-rows {
          &:first-child .table-users__header-cell .cell {
            color: $dark-grey-1000;
            padding: 0 18px;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            min-height: 26px;
          }
        }
      }
    }

    .el-table__body-wrapper ~ .el-table__fixed-right {
      @include shadow-1();
      margin-right: -2px;
    }
  }

  .is-group .cell {
    font-size: 1.6rem;
  }

  .is-group &__header-cell {
    background: transparent !important;
    border-right: 0;
    color: $black;
  }

  .is-group &__header-cell {
    border-bottom: none !important;
  }

  &__rows &__cell {
    border-right: none;
    background: $white;
    color: $dark-blue;
  }

  .table-users {
    &__rows {
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
        }
      }
    }
  }

  &__filter {
    &-status {
      .el-input--suffix .el-input__inner {
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        padding-left: 12px;
      }
      &-indicator {
        background-color: $dark-grey-200;
        margin: 0 auto;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        &_active {
          background-color: $green-1000;
        }
      }
    }

    &-add-place {
      .el-input--suffix .el-input__inner {
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        padding-left: 12px;
      }
    }

    &-full-name__input {
      &.el-input {
        max-width: 260px;
      }
    }

    &-login {
      &.el-input {
        max-width: 200px;
      }
    }

    &-date {
      &.el-range-editor {
        &.el-input__inner {
          width: auto;
        }
        .el-range-input {
          max-width: 80px;
        }
        .el-range-separator {
          width: 15px;
        }
        .el-input__icon.el-range__icon.el-icon-date {
          order: 2;
        }
        .el-input__icon.el-range__close-icon {
          order: 1;
        }
      }
    }
  }

  &__buttons {
    &-edit {
      &.el-button {
        height: 20px;
        width: 20px;
        padding: 0;
        .el-icon-edit {
          color: $dark-grey-1000;
          font-size: 16px;
        }
        &:hover {
          opacity: .7;
        }
        &:active {
          background-color: $dark-grey-100;
        }
      }
    }
  }
}
</style>