<template>
  <div v-show="haveFilters" class="iz-filters iz-filters">
    <div
      class="iz-filters__container"
      :class="{ 'iz-filters__container-shadow': showSplitElement }"
      @wheel="handleWheel">
      <div
        class="iz-filters__tags"
        ref="tags">
        <el-tag
          v-for="(filter, index) in filters"
          :key="filter.field"
          class="iz-filters__tag"
          ref="tag"
          closable
          effect="plain"
          :disable-transitions="true"
          @close="removeFilter(index)">
          <span class="iz-filters__tag-name">{{ filter.name }}</span>
          <span class="iz-filters__tag-label">{{ filter.label }}</span>
        </el-tag>
      </div>
    </div>
    <el-button
      class="iz-filters__control"
      @click="handleClear">
      {{ $t('message.common.components.Filters.resetFilters') }} (<b>{{ filters.length }}</b>)
    </el-button>
  </div>
</template>

<script>
export default {
  name: "Filters",

  props: {
    filters: {
      type: Array,
      default: () => ([]),
    },

    observerStyle: {
      type: Boolean,
      default: true,
    }
  },

  data() {
    return {
      observer: null,
      oldObserves: [],
      showSplitElement: false,
    };
  },
  
  computed: {
    haveFilters() {
      return !!this.filters.length;
    }
  },

  watch: {
    filters: {
      immediate: true,
      handler(_filters) {
        if (_filters.length && this.observerStyle) {
          this.$nextTick(() => {
            if (this.observer) {
              this.observeTags(this.$refs.tag);
            } else {
              this.createObserver();
            }
          });
        }
      }
    }
  },

  mounted() {
    if (this.observerStyle) {
      this.$nextTick(() => {
        this.createObserver();
      });
    }
  },

  beforeDestroy() {
    this.observer = null;
  },

  methods: {
    createObserver() {
      if (!this.observerStyle) return;

      if (!this.observer) {
        const RootElement = this.$refs.tags;

        if (RootElement) {
          const options = {
            root: RootElement,
            rootMargin: '0px',
            threshold: 1,
          };

          this.observer = new IntersectionObserver(this.callbackObserver, options);
          this.observeTags(this.$refs.tag);
        }
      }
    },

    observeTags(tags) {
      if (tags && tags.length) {
        if (this.oldObserves.length) {
          this.oldObserves.forEach(target => this.observer.unobserve(target));
          this.oldObserves = [];
        }

        tags.forEach(target => {
          this.oldObserves.push(target.$el);
          this.observer.observe(target.$el);
        });
      }
    },

    /**
     * Обработка cb функции обсервера
     */
    callbackObserver(entries) {
      let isShowMore = false;
      let sum = 0;
      entries.forEach(entry => {
        const entryRatio = entry.intersectionRatio;
        sum += entryRatio;
        if (entryRatio < .99) {
          isShowMore = true;
        }
      });

      this.showSplitElement = (
        (entries.length && sum !== 0) &&
        (isShowMore || (this.filters.length !== entries.length))
      );
    },

    changeFilters(value) {
      this.$emit('change', value);
    },

    handleClear() {
      this.changeFilters([]);
    },

    removeFilter(index) {
      this.changeFilters(this.filters.filter((_, _index) => index !== _index));
    },

    handleWheel(event) {
      const tags = this.$refs.tags;
      
      if (tags && event.deltaY != 0) {
        let modifier = 0;

        switch(event.deltaMode) {
          case event.DOM_DELTA_PIXEL: {
            modifier = 1;
            break;
          }
          case event.DOM_DELTA_LINE: {
            modifier = parseInt(getComputedStyle(tags).lineHeight);
            break;
          }
          case event.DOM_DELTA_PAGE: {
            modifier = tags.clientHeight;
            break;
          }
        }

        // замена вертикальной прокрутки горизонтальной
        tags.scrollLeft += modifier * event.deltaY;
        event.preventDefault();
      }
    }
  },
};
</script>

<style lang="scss">
.iz-filters {
  display: flex;
  flex-wrap: nowrap;
  padding-left: 8px;
  & &__control {
    height: 28px;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    padding: 5px 12px;
    border: 1px solid $dark-grey-200;
    margin-left: 8px;
  }

  & &__tag {
    height: 28px;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    padding: 5px 8px 5px 4px;
    border: 1px solid $dark-grey-200;
    margin-left: 8px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    &-name {
      background-color: $light-blue-100;
      padding: 0 4px;
      border-radius: 4px;
      font-weight: 500;
    }
    &-label {
      margin-left: 4px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      display: block;
      max-width: 200px;
    }
    :first-child {
      margin-left: 0;
    }
    .el-tag__close {
      margin-top: 4px;
    }
  }
  
  &__container {
    overflow: hidden;
    padding: 0 2px 0 0;
    display: flex;
    min-width: 0;
    &-shadow {
      position: relative;
      &::before {
        @include shadow(0px 0px 4px 0px rgba(126, 126, 126, 0.15));
        position: absolute;
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        z-index: 0;
        width: calc(100% - 2px);
        left: 0px;
      }
    } 
  }

  &__tags {
    max-width: 100%;
    overflow: auto;
    display: flex;
    flex-wrap: nowrap;
    margin: 0 2px 0 0;
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    .iz-filters__tag:first-child {
      margin-left: 0;
    }
  }
}
</style>