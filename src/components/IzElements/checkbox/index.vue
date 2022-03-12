<template>
  <Checkbox
    class="iz-checkbox"
    v-bind="$attrs"
    v-on="$listeners">
    <slot />
  </Checkbox>
</template>

<script>
import { Checkbox } from 'element-ui';

export default {
  name: "IzCheckbox",

  components: {
    Checkbox,
  }
}
</script>

<style lang="scss">
.iz-checkbox {
  &.el-checkbox {
    color: $dark-grey-1000;
    .el-checkbox {
      &__input {
        width: 18px;
        height: 18px;
        .el-checkbox__inner {
          border: 1px solid $light-grey-1000;
          width: 100%;
          height: 100%;
          
          &::after {
            left: calc(50% - 2.5px);
            top: calc(50% - 5px);
            border: 1px solid $white;
            border-left: 0;
            border-top: 0;
          }

          &::before {
            left: calc(50% - 7.5px);
            top: calc(50% - 1px);
            height: 3px;
            width: 15px;
          }
        }
        
        &.is-focus {
          .el-checkbox__inner {
            border: 1px solid $dark-grey-800;
          }
        }
      }

      &__label {
        color: $dark-grey-1000;
      }
    }

    &.is-checked {
      .el-checkbox__inner {
        border: 1px solid $light-blue-1000;
      }
      .el-checkbox__label {
        color: $dark-grey-1000;
      }
    }
     
    &.is-disabled {
      &.is-checked {
        .el-checkbox__inner {
          border: 1px solid $dark-grey-200;
          background-color: $dark-grey-200;
          &::after {
            border-color: $white;
          }
        }
      }

      .el-checkbox__inner {
        border: 1px solid rgba($light-grey-1000, .5);
        background-color: $white;
      }

      .el-checkbox__label {
        color: $dark-grey-200;
      }
    }

    &:hover:not(.is-disabled) {
      .el-checkbox {
        &__input:not(.is-focus) {
          .el-checkbox__inner {
            border: 1px solid $dark-grey-800;
          }
        }
      }
    }

    &:active:not(.is-disabled) {
      .el-checkbox {
        &__input:not(.is-focus)  {
          .el-checkbox__inner {
            border: 2px solid $dark-blue-1000;
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>