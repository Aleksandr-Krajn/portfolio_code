<template>
  <el-aside class="sidebar" width="auto">
    <el-menu
      class="sidebar__menu"
      ref="menu"
      :default-active="menuDefault.active"
      :default-opened="menuDefault.opened"
      :router="true"
      :class="{ 'sidebar__menu--close': !sideBarOpened }"
      :collapse="!sideBarOpened"
      @open="handleChangeOpenSubmenu($event, true)"
      @close="handleChangeOpenSubmenu($event, false)">
      <HeaderSidebar />

      <div class="sidebar__content">
        <template v-for="(_module, _index) in getMenu"> 
          <MenuItem
            :key="_index"
            :sideBarOpened="sideBarOpened"
            v-bind="_module"/>
        </template>
      </div>

      <FooterSidebar />
    </el-menu>
  </el-aside>
</template>

<script>
import { mapState } from 'vuex';

import permissions from '@/assets/constants/permissions';
import { eachRecursiveFilter, eachRecursive } from 'assets/js/utils';

import HeaderSidebar from "./components/HeaderSidebar.vue";
import FooterSidebar from "./components/FooterSidebar.vue";
import MenuItem from "./components/MenuItem.vue";

export default {
  name: 'Sidebar',

  components: {
    HeaderSidebar,
    FooterSidebar,
    MenuItem,
  },

  data() {
    return {
      menuDefault: {
        opened: [],
        active: '',
      },
      menu: [
        {
          name: this.$t('message.admin._root.administration'),
          icon: 'setting',
          index: 'administration',
          children: [
            {   
              name: this.$t('message.admin.rights.namePage'),
              link: '/administration/rights',
              index: 'rights',
              permissions: [permissions.ACCESS_RIGHTS_MANAGEMENT],
            },
            {
              name: this.$t('message.admin.users.namePage'),
              link: '/administration/users',
              index: 'users',
              permissions: [permissions.USER_MANAGEMENT],
            },
          ]
        },
        
        {
          name: this.$t('message.planning._root.planningTitle'),
          icon: 'data-line',
          index: 'planning',
          children: [
            {
              name: this.$t('message.planning.productionApplications.namePage'),
              link: '/planning/production-applications',
              index: 'production-applications',
              permissions: [permissions.VIEW_PRODUCTION_APPLICATION],
            },
          ]
        },
      ],
    }
  },

  computed: {
    ...mapState('Authorization', {
      sideBarOpened: state => (state.userInterfaceSettings ? state.userInterfaceSettings.sideBarOpened : true),
    }),

    getMenu() {
      const f = (element) => {
        const isPermissed = !element.permissions || element.permissions.some(s => this.$perm(s));
        if (!isPermissed) {
          return false;
        }

        const isChildNotEmpty = (
          element.link ||
          (!element.children || eachRecursiveFilter(element.children, f).length)
        ); 
        return isChildNotEmpty;
      };

      return eachRecursiveFilter(this.menu, f);
    }
  },

  watch: {
    sideBarOpened(value) {
      /**
       * Если меню разворачиваем, то открываем все нужные вершины
       * самостоятельно через внутренний интерфейс компонента
       */
      if (value) {
        setTimeout(() => {
          if (this.$refs.menu && this.$refs.menu.open) {
            eachRecursive(this.getMenu, item => {
              if (this.menuDefault.opened.includes(item.index) && this.$refs.menu.submenus[item.index]) {
                this.$refs.menu.open(item.index);
              }
            });
          }
        }, 500);
      }
    }
  },
  
  created() {
    this.initializeDefaultState();
  },

  methods: {
    /**
     * Инициализация состояния меню
     */
    initializeDefaultState() {
      const defaultOpened = new Set();
      let defaultActive = '';

      eachRecursive(this.getMenu, element => {
        if (this.$route.path === element.link) {
          if (element.parent && element.parent.index) {
            defaultOpened.add(element.parent.index.toString());
          }
          defaultActive = element.index.toString();
        }
      });

      this.menuDefault = {
        opened: [...defaultOpened],
        active: defaultActive
      };
    },

    /**
     * Метод обновления состояния меню в зависимост от открытых вершинх
     */
    handleChangeOpenSubmenu(index, flag) {
      if (flag) {
        this.menuDefault.opened.push(index.toString());
      } else {
        const _index = this.menuDefault.opened.indexOf(index.toString());
        if (~index) {
          this.menuDefault.opened.splice(_index, 1);
        }
      }
    }
  }
}
</script>

<style lang="scss">
.sidebar {
  // Миксин изменения цвета иконок для компонента IzIcon
  @mixin color-icon($color) {
    i {
      color: $color;
    }
    svg.iz-icon {
      path {
        fill: $color;
      }
    }
  }

  @include shadow-2();
  min-height: 100vh;
  background: $light-grey-50;
  transition: all 1s;

  &__content {
    overflow: hidden auto;
    flex: 1;

    &::-webkit-scrollbar {
      width: 0.6rem;
      height: 0.6rem;
    }

    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 3px;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      -webkit-border-radius: 3px;
      border-radius: 3px; 
    }
  }

  &__menu {
    height: 100%;
    background: $light-grey-50;
    display: flex;
    flex-direction: column;
    min-height: 0;
    max-height: 100vh;
    &:not(.el-menu--collapse) {
      width: 25.5rem;
    }

    .el-menu {
      background-color: inherit;
    } 
  }
  

  &__popper {
    .el-menu {
      background-color: $light-grey-50;
    }
  }
}
</style>