<template>
  <div 
    v-if="!isLoadingPage"
    class="admin-users page">
    <div class="admin-users__header">
      <z-arrow-btn disabled>{{ namePage }}</z-arrow-btn>

      <div class="admin-users__button-group">
        <el-button 
          type="primary"
          icon="el-icon-plus"
          @click="addUser">
          {{ $t('message.admin.users.buttons.addUser') }}
        </el-button>
      </div>
    </div>

    <div class="admin-users__controls">
      <FiltersUsers class="admin-users__filters"/>
      <IzPagination
        class="admin-users__pagination"
        v-show="meta.total > meta.pageSize"
        :total="meta.total"
        :current-page="routeQueryNormalize.page"
        :page-size="routeQueryNormalize.size"
        layout="prev, pager, next, jumper"
        @current-change="handleChangePage">
      </IzPagination>
    </div>

    <div class="admin-users__table">
      <TableUsers />
    </div>

    <DrawersUser />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { isEqual } from 'lodash-es';

import IzPagination from '@/components/IzElements/pagination';

import FiltersUsers from '@/modules/administration/components/Filters/FiltersUsers';
import TableUsers from '@/modules/administration/components/Tables/TablesUsers';
import DrawersUser from '@/modules/administration/components/Drawers/DrawersUser';

export default {
  name: 'UsersPage',

  components: {
    TableUsers,
    DrawersUser,
    FiltersUsers,
    IzPagination,
  },

  provide() {
    return {
      fetchUsers: this.fetchUsers,
    }
  },
  
  data() {
    return {
      isLoadingPage: true,
    }
  },

  computed: {
    ...mapState('Administration/Users', {
      isLoadingUsers: state => state.loadings.users,
      meta: state => state.meta,
    }),

    ...mapGetters('Administration/Users', [
      'sendUsersParams',
      'routeQueryNormalize'
    ]),

    namePage() {
      return this.$route.meta.name
    }
  },

  watch: {
    sendUsersParams: {
      immediate: true,
      handler(newValue) {
        this.loadUsers(newValue);
      }
    }
  },

  created() {
    this.isLoadingPage = false;
  },

  methods: {
    ...mapActions('Administration/Users', [
      'loadUsers',
    ]),

    ...mapMutations('Drawers', [
      "openDrawer",
    ]),

    fetchUsers(query = null) {
      /**
       * Если параметры в url изменились, то изменяем route,
       * наче просто обновляем без перехода,
       */
      if (query && !isEqual(this.$route.query, query)) {
        this.$router.push({ query });
      } else {
        this.loadUsers(this.sendUsersParams);
      }
    },

    addUser() {
      this.openDrawer({
        module: 'administration',
        drawer: 'userEditor',
        data: { action: 'create' },
      });
    },

    /**
     * Обработка изменения данных в пагинаторе
     */
    handleChangePage(page) {
      this.fetchUsers({
        ...this.$route.query,
        page: page.toString(),
      });
    },
  }
}
</script>

<style lang="scss">
  .admin-users {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
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
      max-width: 70%;
      margin-right: 30px;
    }
    
    &__pagination {
      display: flex;
      justify-content: flex-end;
      height: 28px;
      margin-left: auto;
    }
  }
</style>