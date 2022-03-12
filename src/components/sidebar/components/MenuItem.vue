<template>
  <div
    class="sidebar__menu-item"
    :class="{
      'sidebar__menu-item_root': isRoot,
      'sidebar__menu-item_close': !sideBarOpened,
      'sidebar__menu-item_medium': level === 1,
      'sidebar__menu-item_small': level > 1,
    }">
    <el-menu-item
      v-if="!children"
      class="sidebar__item"
      :route="link"
      :key="`sidebar__link_${ index }`"
      :index="index">
      <div v-show="icon" class="sidebar__item-icon">
        <IzIcon :name="icon" :library="iconLibrary"/>
      </div>
      <template #title>
        <span class="sidebar__item-text">{{ name }}</span>
      </template>
    </el-menu-item>
    <el-submenu
      v-else-if="children && children.length"
      class="sidebar__submenu"
      :class="{
        'sidebar__menu-item__submenu-custom': isCustomSubmenu,
      }"
      ref="submenu"
      popper-class="sidebar__popper"
      @click.native.capture="handleClickSubmenu"
      :index="index">
      
      <!--
        Встраивание в текущий компонент меню
        опцию атквного пункта родителя у подменю -->
      <template #title>
        <template v-if="isCustomSubmenu">
          <el-menu-item
            class="sidebar__item sidebar__item-submenu"
            :route="link"
            :key="`sidebar__link_${ index }`"
            ref="custom-item-submenu"
            :index="index">
            <div class="sidebar__item-icon">
              <IzIcon v-show="icon" :name="icon" :library="iconLibrary"/>
              <div 
                ref="custom-icon"
                class="sidebar__menu-item__submenu-custom__icon"
                :class="{ 'sidebar__menu-item__submenu-custom__icon_opened': customExpand }">
                <IzIcon
                  v-if="link && customExpand !== null"
                  class="sidebar__menu-item__submenu-custom__icon-minus"
                  name="minus" :library="iconLibrary"/>
                <IzIcon
                  v-if="link && customExpand !== null"
                  class="sidebar__menu-item__submenu-custom__icon-plus"
                  name="plus" :library="iconLibrary"/>
              </div>
            </div>
            <template #title>
              <span class="sidebar__item-text">{{ name }}</span>
            </template>
          </el-menu-item>
        </template>
        <template v-else>
          <div class="sidebar__submenu__title">
            <div v-show="icon" class="sidebar__item-icon">
              <IzIcon :name="icon" :library="iconLibrary"/>
            </div>
            <span
              v-if="sideBarOpened"
              class="sidebar__submenu__title-text">
              {{ name }}
            </span>
          </div>
        </template>
      </template>

      <template v-for="(item, _index_item) in children">
        <MenuItem
          :key="_index_item"
          :sideBarOpened="sideBarOpened"
          :level="level + 1"
          v-bind="item"/>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import IzIcon from 'IzElements/icon';

export default {
  name: "MenuItem",

  components: {
    IzIcon,
  },

  props: {
    sideBarOpened: {
      type: Boolean,
      require: true,
    },

    children: {
      type: Array,
      default: null,
    },

    index: {
      type: String,
      require: true,
    },

    icon: {
      type: String,
      default: null,
    },

    iconLibrary: {
      type: String,
      default: undefined,
    },

    name: {
      type: String,
      default: null
    },

    link: {
      type: String,
      default: null,
    },

    level: {
      type: Number,
      default: 0,
    }
  },

  data() {
    return {
      customExpand: null,
    }
  },

  computed: {
    isCustomSubmenu() {
      return this.link && this.children && this.children.length;
    },

    isRoot() {
      return this.level === 0;
    }
  },

  methods: {
    updateCustomExpandValue() {
      setTimeout(() => {
        if (this.$refs.submenu) {
          this.customExpand = !!this.$refs.submenu.opened;
        }
      }, 350);
    },

    handleClickSubmenu(event) {
      if (this.isCustomSubmenu) {
        const targetCustomIcon = this.$refs['custom-icon'];
        const isIcon = targetCustomIcon && (event.target === targetCustomIcon || targetCustomIcon.contains(event.target));

        const submenuTitle = this.$refs.submenu.$refs['submenu-title'];
        const isSubmenuTitle = submenuTitle && (event.target === submenuTitle || submenuTitle.contains(event.target));
        
        if (isIcon) {
          event.stopPropagation();
          event.preventDefault();

          this.$refs.submenu.handleClick();
          this.updateCustomExpandValue();
          return;
        }
        
        if (!isIcon && isSubmenuTitle) {
          event.stopPropagation();
          event.preventDefault();

          const customSubmenuItem = this.$refs['custom-item-submenu'];
          if (customSubmenuItem) {
            customSubmenuItem.handleClick();
          }
        }
      }
    }
  },

  mounted() {
    this.updateCustomExpandValue();
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

  & &__menu--close {
    margin: 0;
    &.horizontal-collapse-transition {
      .sidebar {
        &__item {
          border-radius: 28px;
          transition: border-radius .3s;
          border: none;
          &-text {
            width: 0;
            transition: width .3s;
          }
        }
        &__submenu,
        &__item {
          width: 56px;
          margin: 0;
          transition: width .5s;
        }
        
        &__menu-item {
          &_root {
            overflow: hidden;
            transition: width .5s;
            margin: 0;

            .sidebar__submenu__title > .sidebar__item-icon i {
              line-height: 26px;
            }
            .sidebar {
              &__item-text {
                width: 0;
                transition: width .3s, visibility .5s;
                visibility: hidden;
              }
              &__item-submenu {
                margin-left: -20px;
              }
            }
          }
        }
      }
    }
    
    &:not(.horizontal-collapse-transition) {
      .sidebar {
        &__submenu,
        &__item {
          width: 56px;
          min-width: 56px;
          &-icon {
            margin-left: -1px;
          }
          overflow: hidden;
          border-radius: 50%;
          margin: 0 auto;
          &.is-active {
            background-color: $dark-grey-200;
            color: $dark-blue-1000;
            border: none;
            & .sidebar__item-icon {
              @include color-icon($dark-blue-1000);
            }
          }
        }

        &__submenu {
          &.is-active {
            &:hover {
              .el-submenu__title,
              .sidebar__item-submenu {
                background-color: $dark-grey-200;
                color: $dark-blue-1000;
              }
            }

            .el-submenu__title:active {
              background-color: $dark-grey-100;
            }
          }
        }

        &__menu-item {
          &_root {
            .sidebar__submenu__title > .sidebar__item-icon i {
              line-height: 24px;
            }

            .sidebar {
              &__submenu {
                .el-submenu__title {
                  .el-submenu__icon-arrow {
                    display: none;
                  }
                }
              }
              &__item-text {
                width: 0;
                transition: width .3s, visibility .5s;
                visibility: hidden;
              }
              &__item-submenu {
                margin-left: 0px;
              }
              &__menu-item {
                &__submenu-custom__icon {
                  display: none;
                }
              }
            }
          }
        }
      }
    }
    
    &.sidebar__menu .sidebar__item-icon {
      width: 18px;
      font-size: 20px;
      i {
        width: 20px;
        height: 20px;
        margin: 0;
        line-height: 22px;
        &.mdi:before {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  & &__menu-item {
    .sidebar__item-icon i {
      line-height: 16px;
    }
    .sidebar__submenu__title > .sidebar__item-icon i {
      line-height: 20px;
    }
    &_medium {
      .sidebar__item-icon i {
        line-height: 16px;
      }
    }
    &_small {
      .sidebar__item-icon i {
        line-height: 15px;
      }
    }
  }

  &__menu-item {
    &:not(.sidebar__menu-item_root) {
      .sidebar__item-icon {
        margin-left: -20px;
      }
    }

    &__submenu-custom {
      .el-submenu__icon-arrow {
        display: none;
      }
      &.is-opened > .el-submenu__title &__icon {
        &-plus {
          visibility: hidden;
          opacity: 0;
        }
        &-minus {
          visibility: visible;
          opacity: 1;
        }
      }

      &__icon {
        position: absolute;
        right: 20px;
        font-size: 16px;
        width: 16px;
        height: 16px;
        > i {
          position: absolute;
          transition: opacity .3s, visibility .3s;
        }

        > &-plus {
          visibility: visible;
          opacity: 1;
        }
        > &-minus {
          visibility: hidden;
          opacity: 0;
        }
      }
      .el-submenu__title {
        padding: 0 !important;
      }
    }

    &_medium {
      .sidebar__item,
      .sidebar__submenu__title {
        height: 44px !important;
        .sidebar__item-icon {
          line-height: 42px;
        }
      }
      .sidebar {
        &__item {
          height: 44px;
          &-text {
            line-height: 44px;
          }
        }
        &__submenu {
          .el-submenu {
            &__title {
              height: 44px;
              line-height: 44px;
            }
            &__icon-arrow {
              margin-top: -5px;
            }
          }
        }
      }
    }

    &_small {
      .sidebar__item,
      .sidebar__submenu__title {
        height: 32px !important;
        .sidebar__item-icon {
          line-height: 30px;
        }
      }
      .sidebar {
        &__item {
          height: 32px;
          &-text {
            line-height: 32px;
          }
        }
        &__submenu {
          .el-submenu {
            &__title {
              height: 32px;
              line-height: 32px;
            }
            &__icon-arrow {
              margin-top: -5px;
            }
          }
        }
      }
    }
  }

  &__submenu {
    transition: all 0.3s;
    .el-submenu__title {
      &:hover {
        background-color: $dark-grey-50;
      }
      i {
        color: $dark-grey-800;
      }
    }
    &.is-opened {
      .el-submenu__title {
        i {
          color: $dark-grey-1000;
        }
      }
      .sidebar__submenu {
        &__title {
          @include color-icon($dark-grey-1000);
          color: $dark-grey-1000;
        }
      }
    }

    &.is-active {
      background-color: $light-grey-100;
    }

    &__title {
      color: $dark-grey-800;
      display: flex;
      span {
        flex: 1;
      }
    }
    .sidebar__item {
      height: 100%;
      line-height: inherit;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    color: $dark-grey-800;
    height: 56px;
    width: 100%;
    transition: all 0.3s;
    background-color: inherit;

    i {
      color: $dark-grey-800;
    }
    &:hover {
      background-color: $dark-grey-50;
    }

    &:focus {
      background: transparent;
    }

    &.is-active {
      background-color: $dark-grey-200;
      color: $dark-blue-1000;
      border-right: 2px solid $dark-blue-1000;
      .sidebar__item-icon {
        @include color-icon($dark-blue-1000);
      }
      
      .sidebar__item-text {
        color: $dark-blue-1000;
      }

      .sidebar__menu-item__submenu-custom__icon {
        right: 18px;
      }
    }
    &-submenu {
      padding-right: 20px !important;
      margin-left: -20px;
      width: calc(100% + 20px);
      .sidebar__item-text,
      .sidebar__item-icon {
        height: 100%;
        line-height: inherit;
      }
    }
  }

  & &__item-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 52px;
    width: 14px;
    font-size: 14px;
    margin-right: 5px;
    transition: all .3s;
    i {
      width: 14px;
      height: 14px;
      margin: 0;
      padding: 0;
      color: $dark-grey-800;
      display: block;
      line-height: 18px;
      &.mdi:before {
        width: 14px;
        height: 14px;
        top: 0;
        position: absolute
      }
    }
  }
}

.sidebar__popper {
  .sidebar {
    &__item.is-active {
      .sidebar {
        &__menu-item__submenu-custom__icon {
          right: 8px;
        }
      }  
    }

    &__menu-item {
      &__submenu-custom {
        .sidebar {
          &__item-submenu {
            margin-left: 0;
            width: 100%;
          }
          &__menu-item__submenu-custom__icon {
            display: inline-block !important;
            right: 10px;
            margin-top: -8px;
            top: 50%;
          }
        }
      }
      .sidebar__item-icon {
          display: inline-block;
          margin-right: 5px;
          margin-left: -5px;
        }
    }
  }
}


// Применение transition класса меню
.v-enter-active,
.v-leave-active {
  .sidebar {
    &__item-text,
    &__submenu__title-text {
      transition: width .1s, opacity .3s;
    }
    &__item-submenu {
      transition: margin-left .3s;
    }
  }
}

.v-enter,
.v-leave-to {
  .sidebar {
    &__item-text,
    &__submenu__title-text {
      width: 0px;
      opacity: 0;
    }
  }
}

.v-leave-to {
  .sidebar {
    &__item-submenu {
      margin-left: 0px;
    }
  }
}
</style>