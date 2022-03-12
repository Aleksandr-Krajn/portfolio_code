<template>
  <Filters
    class="filters-users"
    :filters="filters"
    @change="handleChangeFilters"/>
</template>

<script>
import { mapGetters } from 'vuex';
import { format } from 'date-fns';

import Filters from '@/components/Filters';

export default {
  name: 'FiltersUsers',

  components: {
    Filters,
  },
  
  inject: [
    'fetchUsers',
  ],

  data() {
    return {
      filters: [],

      names: {
        id: this.$t('message.admin.users.tables.users.header.id'),
        is_active: this.$t('message.admin.users.tables.users.header.status'),
        full_name: this.$t('message.admin.users.tables.users.header.fullName'),
        role_id: this.$t('message.admin.users.tables.users.header.role'),
        login: this.$t('message.admin.users.tables.users.header.login'),
        created_at: this.$t('message.admin.users.tables.users.header.createdDate'),
        from_ad: this.$t('message.admin.users.tables.users.header.addPlace'),
        ordering: this.$t('message.common.fields.ordering'),
      },

      allFiltersFields: [
        'id',
        'is_active',
        'full_name',
        'role_id',
        'login',
        'created_at',
        'from_ad',
        'ordering',
      ],

      filterLabel: {
        role_id: this.getRoleLabel,
        is_active: this.getStatusLabel,
        from_ad: this.getPlaceLabel,
      },
    }
  },

  computed: {
    ...mapGetters('Authorization', [
      'mapRoles',
    ]),

    ...mapGetters('Administration/Users', [
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
    getStatusLabel(status) {
      return status
        ? this.$t('message.common.fields.active')
        : this.$t('message.common.fields.inactive');
    },

    getPlaceLabel(place) {
      return place
        ? this.$t('message.common.fields.activeDirectory')
        : this.$t('message.common.fields.locally');
    },

    getRoleLabel(id) {
      return this.mapRoles.has(id) ? this.mapRoles.get(id).title : '';
    },

    fillFilters(query) {
      const result = [];
      ['id', 'role_id', 'is_active', 'from_ad'].forEach(key => {
        if (query[key] !== undefined) {
          result.push({
            field: key,
            name: this.names[key],
            label: this.filterLabel[key] ? this.filterLabel[key](query[key]) : query[key].toString(),
            value: query[key],
          });
        }
      });

      ['full_name', 'login'].forEach(key => {
        if (query[key]) {
          result.push({
            field: key,
            name: this.names[key],
            label: query[key],
            value: query[key],
          });
        }
      });

      if (query.date_from && query.date_to) {
        const dates = [
          new Date(query.date_from),
          new Date(query.date_to),
        ];

        result.push({
          field: 'created_at',
          name: this.names.created_at,
          label: dates.map(date => format(date, 'dd.MM.yyyy')).join(' - '),
          value: dates
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
      const newQuery = { ...this.$route.query, page: '1' };
      const _fields = filters.map(({ field }) => field);
      this.allFiltersFields.forEach(field => {
        if (!_fields.includes(field)) {
          if (field === 'created_at') {
            newQuery['date_from'] = undefined;
            newQuery['date_to'] = undefined;
          } else {
            newQuery[field] = undefined;
          }
        }
      });
      this.fetchUsers(newQuery);
    }
  }
}
</script>