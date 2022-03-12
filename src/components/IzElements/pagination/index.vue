<template>
  <div class="iz-pagination">
    <slot name="prepand-pagination" />
    <Pagination
      class="iz-pagination__pagination"
      v-bind="$attrs"
      v-on="$listeners">
      <template
        v-for="(_, name) in $scopedSlots"
        #[name]="slotData">
        <slot
          :name="name"
          v-bind="slotData" />
      </template>
    </Pagination>
    <slot name="append-pagination" />
  </div>
</template>

<script>
import { Pagination } from 'element-ui';

export default {
  name: "IzPagination",

  components: {
    Pagination,
  }
}
</script>

<style lang="scss">
.iz-pagination {
  &__pagination {
    &.el-pagination {
      color: $dark-grey-800;
      font-weight: 500;

      .number {
        font-size: 12px;
      }

      .active,
      .number:hover,
      button:hover {
        color: $light-blue-1000;
      }

      .el-icon-more {
        color: $dark-grey-800;
        &::before {
          font-size: 12px;
          font-weight: 500;
        }
      }

      .el-pagination {
        &__jump {
          font-weight: normal;
          color: $dark-grey-800;
          font-size: 14px;
          line-height: 22px;
          margin-left: 20px;
          .el-pagination__editor {
            margin: 0 8px;
            padding: 0;
            width: 40px;
          }
          .el-input__inner {
            color: $dark-grey-800;
          }
        }
      }
    }
  }
}
</style>