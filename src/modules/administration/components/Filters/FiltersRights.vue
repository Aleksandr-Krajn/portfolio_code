<template>
  <Filters
    class="filters-rights"
    :filters="filters"
    @change="handleChangeFilters"/>
</template>

<script>
import { mapGetters } from 'vuex';

import Filters from '@/components/Filters';

export default {
  name: 'FiltersRights',

  components: {
    Filters,
  },
  
  inject: [
    'fetchRoles',
  ],

  data() {
    return {
      filters: [],

      names: {
        role_name: this.$t('message.admin.rights.table.role'),
        ordering: this.$t('message.common.fields.ordering'),
      },
      allFiltersFields: [
        'role_name',
        'ordering'
      ],

      filterLabel: {},
    }
  },

  computed: {
    ...mapGetters('Authorization', [
      'mapRoles',
    ]),

    ...mapGetters('Administration/Rights', [
      'routeQueryNormalize',
    ]),
  },

  watch: {
    routeQueryNormalize: {
      immediate: true,
      handler(newValue) {
        this.fillFilters(newValue);
      }
    },
  },

  methods: {
    fillFilters(query) {
      const result = [];
      if (query.role_name) {
        result.push({
          field: 'role_name',
          name: this.names.role_name,
          label: query.role_name,
          value: query.role_name,
        });
      }

      if (query.ordering) {
        result.push({
          field: 'ordering',
          name: this.names.ordering,
          label: this.names[query.ordering.field],
          value: query.ordering.value,
        });
      }

      this.filters = result;
    },

    handleChangeFilters(filters) {
      const newQuery = { ...this.$route.query };
      const _fields = filters.map(({ field }) => field);
      this.allFiltersFields.forEach(field => {
        if (!_fields.includes(field)) {
          newQuery[field] = undefined;
        }
      });
      this.fetchRoles(newQuery);
    }
  }
}
</script>