<template>
  <div class="filters-input" :style="filterSetting.styles">
    <div v-if="filterSetting.type === 'text'" class="filters-input__element">
      <el-input
        prefix-icon="el-icon-search"
        v-model="values"
        @input="changeFilter"
        :placeholder="filterSetting.placeholder"
      />
    </div>

    <div v-if="filterSetting.type === 'autocomplete'" class="filters-input__element">
      <el-autocomplete
        v-model="values"
        prefix-icon="el-icon-search"
        class="filters-input__autocomplete"
        :fetch-suggestions="querySearch"
        :placeholder="filterSetting.placeholder"
        @change="changeFilter"
        @select="handleSelect"
      >
      <template slot-scope="{ item }">
        <div class="filters-input__autocomplete-value">{{ item[filterSetting.prop] }}</div>
      </template>
      </el-autocomplete>
    </div>

    <div v-if="filterSetting.type === 'select'">
      <el-select 
        v-model="values"
        popper-class="filters-input__select"
        :placeholder="filterSetting.placeholder"
        @change="changeFilter"
      >
        <el-option 
          label="Все"
          class="filters-input__option"
          value="">
        </el-option>

        <el-option
          v-for="option in filterSetting.options"
          :key="option.value ? option.value : option"
          :label="option.text ? option.text : option"
          :value="option.value ? option.value : option"
          class="filters-input__option">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterInput',

  props: {
    filterModule: [String],
    filterData: [Array],
    filterSetting: [Object],
    value: [String, Number],
  },

  data(){
    return {
      values: '',
    }
  },

  methods: {
    changeFilter() {
      this.$store.commit(`${this.filterModule}/editFilters`, { 
        params: this.filterSetting.prop, 
        value: this.values 
      })
    },

    querySearch(queryString, cb) {
      const results = queryString ? this.filterData.filter(this.createFilter(queryString)) : this.filterData

      cb(results);
    },

    createFilter(queryString) {
      return (params) => {
        return (params[this.filterSetting.prop].toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    handleSelect(value) {
      this.values = value[this.filterSetting.prop]

      this.changeFilter()
    }
  }
}
</script>

<style lang="scss">
  .filters-input {
    &__autocomplete-value,  &__option[class] {
      white-space: normal;
      font-size: $font-sm;
      color: $dark-grey-1000;
      line-height: 2.2rem;
      padding-top: 0.6rem;
      padding-bottom: 0.6rem;
      padding-left: 2rem;
      padding-right: 2rem;
      transition: 0.5s;  
    }

    &__autocomplete-value:hover, &__option:hover {
      color: $light-blue-1000;
      background: $light-blue-100 !important;
    }
  }

  .el-autocomplete-suggestion[class] li{
    padding: 0;
  }
</style>