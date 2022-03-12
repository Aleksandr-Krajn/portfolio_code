<template>
  <div
    v-if="!isLoadingPage"
    class="admin-rights page">
    <div class="admin-rights__header">
      <z-arrow-btn disabled>{{ namePage }}</z-arrow-btn>

      <div class="admin-rights__button-group">
        <el-button 
          type="primary"
          icon="el-icon-plus"
          @click="addRole">
          {{ $t('message.admin.rights.buttons.addRole') }}
        </el-button>
      </div>
    </div>
    <div class="admin-rights__controls">
      <FiltersRights class="admin-rights__filters"/>
    </div>
    <div class="admin-rights__table">
      <TableRights />
    </div>
    <DrawersRole />
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import { isEqual } from 'lodash-es';

import TableRights from '@/modules/administration/components/Tables/TablesRights';
import DrawersRole from '@/modules/administration/components/Drawers/DrawersRole';
import FiltersRights from '@/modules/administration/components/Filters/FiltersRights';

export default {
  name: 'RightsPage',

  components: {
    TableRights,
    DrawersRole,
    FiltersRights,
  },

  provide() {
    return {
      fetchRoles: this.fetchRoles,
    }
  },

  data() {
    return {
      isLoadingPage: true,
    }
  },

  computed: {
    ...mapGetters('Administration/Rights', [
      'routeQueryNormalize'
    ]),

    namePage() {
      return this.$route.meta.name
    },
  },

  watch: {
    routeQueryNormalize: {
      immediate: true,
      handler() {
        this.loadRoles();
      }
    },
  },

  created() {
    this.loadPermissionGroups().finally(() => {
      this.isLoadingPage = false;
    })
  },

  methods: {
    ...mapActions('Administration/Rights', [
      'loadRoles',
      'loadPermissionGroups',
    ]),

    ...mapMutations('Drawers', [
      "openDrawer",
    ]),

    fetchRoles(query = null) {
      /**
       * Если параметры в url изменились, то изменяем route,
       * наче просто обновляем без перехода,
       */
      if (query && !isEqual(this.$route.query, query)) {
        this.$router.push({ query });
      } else {
        this.loadRoles();
      }
    },
    
    /**
     * Отображение панели добавления роли
     */
    addRole() {
      this.openDrawer({
        module: 'administration',
        drawer: 'roleEditor',
        data: { action: 'create' },
      });
    },
  }
}
</script>

<style lang="scss">
  .admin-rights {
    &.page {
      display: flex;
      flex-direction: column;
      min-height: 0;
      max-height: 100%;
      height: 100%;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      height: 40px;
    }

    &__button-group {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__button {
      &:not(:last-child){
        margin-right: 0.8rem;
      }
    }

    &__controls {
      min-height: 56px;
      height: 28px;
      padding: 14px 0;
      display: flex;
      flex-wrap: nowrap;
      background-color: $white;
      min-width: 0;
    }

    &__filters {
      height: 100%;
      flex: 1;
      min-width: 0;
      max-width: calc(100% - 30px);
      margin-right: 30px;
    }
  }
</style>