<template>
   <el-container v-if="isReadyUser" class="iz-default-layout">
    <Sidebar />

    <el-container>
      <el-header>
        <Navigation />
      </el-header>

      <el-main class="iz-default-layout__main">
        <router-view/>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import Sidebar from '@/components/sidebar/Sidebar.vue'
import Navigation from '@/components/navigation/Navigation.vue'

export default {
  components: {
    Sidebar,
    Navigation
  },

  computed: {
    ...mapGetters('Authorization', [
      'isReadyUser',
    ]),
  },
}
</script>

<style lang="scss">
.iz-default-layout {
  &__main {
    max-height: calc(100vh - 60px);
    padding: 2.6rem 2.4rem 0;
    background-color: $light-grey-50;
  }
}
</style>