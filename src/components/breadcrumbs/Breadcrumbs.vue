<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item, index) in listBreadcrumbs" :key="index">{{ item.text }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    computed: {
      listBreadcrumbs() {
        return this.$store.state.Breadcrumbs.breadcrumbs
      }
    },

    watch: {
      $route(){
        this.loadBreadcrumbs()
      }
    },

    mounted() {
      this.loadBreadcrumbs();
    },

    methods: {
      loadBreadcrumbs() {
        const { meta, path } = this.$route

        const items = [
          {
            text: 'Главная',
            disabled: true,
            href: '/',
          },
          {
            text: meta.name,
            disabled: true,
            href: path,
          },
        ]

        this.$store.commit('Breadcrumbs/setBreadcrumbs', items)
      }
    }
  }
</script>