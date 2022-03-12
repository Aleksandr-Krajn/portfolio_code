<template>
  <div class="sidebar__header">
    <LogoSidebar
      v-show="sideBarOpened"
      class="sidebar__header-logo"/>

    <div
      class="sidebar__burger"
      @click="changeOpened(!sideBarOpened)">
      <IzIcon name="menu" library="mdi"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import IzIcon from 'IzElements/icon';
import LogoSidebar from '@/assets/images/logo-sidebar.svg';

export default {
  name: "HeaderSidebar",

  components: {
    IzIcon,
    LogoSidebar,
  },
  
  data() {
    return {
      disabledTimeout: false,
    }
  },

  computed: {
    ...mapState('Authorization', {
      sideBarOpened: state => (state.userInterfaceSettings ? state.userInterfaceSettings.sideBarOpened : true),
    }),
  },

  methods: {
    ...mapActions('Authorization', [
      'updateUserInterfaceSettings',
    ]),

    /**
     * Переключение сворачивания меню
     */
    changeOpened(value) {
      if (this.disabledTimeout) return;
      this.disabledTimeout = true;
      setTimeout(() => {
        this.disabledTimeout = false;  
      }, 1000);
      this.updateUserInterfaceSettings({ sideBarOpened: !!value });
    },
  }
}
</script>

<style lang="scss">
.sidebar {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1.5rem;
    padding-right: 1.9rem;
    padding-bottom: 3.5rem;
    padding-left: 1.9rem;
    height: 85px;
    min-height: 85px;
  }

  &__burger {
    height: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;

    .iz-icon {
      display: flex;
      align-items: center;
      color: $dark-grey-800;
      font-size: 24px;
      height: 24px;
      width: 24px;
    }
  }
}


// Применение transition класса меню
.v-enter-active,
.v-leave-active {
  .sidebar {
    &__header-logo {
      transition: width .3s, opacity .3s;
    }
  }
}

.v-enter,
.v-leave-to {
  .sidebar {
    &__header-logo {
      width: 0px;
      opacity: 0;
    }
  }
}
</style>