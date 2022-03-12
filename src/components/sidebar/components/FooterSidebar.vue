<template>
  <div class="sidebar__footer">
    <el-tooltip
      v-if="!sideBarOpened"
      effect="dark"
      placement="right">
      <IzIcon
        class="sidebar__footer-icon"
        name="phone-outline" />
      <template #content>
        <div class="sidebar__footer-tooltip">
          <span >{{ $t('message.common.supportInfo.departament') }}</span>
          <span >{{ $t('message.common.supportInfo.phone') }}</span>
        </div>
      </template>
    </el-tooltip>
    <template  v-else>
      <div class="sidebar__footer-support">
        <span class="sidebar__footer-departament">{{ $t('message.common.supportInfo.departament') }}</span>
        <span class="sidebar__footer-phone">{{ $t('message.common.supportInfo.phone') }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import IzIcon from 'IzElements/icon';

export default {
  name: "FooterSidebar",
  
  components: {
    IzIcon,
  },

  computed: {
    ...mapState('Authorization', {
      sideBarOpened: state => (state.userInterfaceSettings ? state.userInterfaceSettings.sideBarOpened : true),
    }),
  },
}
</script>

<style lang="scss">
.sidebar {
  &__footer {
    border-top: 1px solid $dark-grey-100;
    margin: 0px 1.9rem 40px 1.9rem;
    padding: 16px 0 0 0;
    width: calc(100% - 3.8rem);
    
    &-support {
      display: flex;
      flex-direction: column;
      min-width: 200px;
    }

    &-departament {
      font-weight: normal;
      font-size: 14px;
      line-height: 14px;
      color: $dark-grey-1000;
      word-break: normal;
    }

    &-phone {
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      color: $dark-grey-500;
      margin-top: 8px;
    }

    &-tooltip {
      display: flex;
      flex-direction: column;
    }

    &-icon {
      width: 26px;
      height: 26px;
      font-size: 20px;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $dark-grey-1000;
    }
  }
}


// Применение transition класса меню
.v-enter-active,
.v-leave-active {
  .sidebar {
    &__footer > * {
      transition: width .3s, opacity .3s;
    }
  }
}

.v-enter,
.v-leave-to {
  .sidebar {
    &__footer > * {
      width: 0px;
      opacity: 0;
    }
  }
}
</style>