<template>
  <div class="navigation">
    <Breadcrumbs />

    <div class="navigation__wrapper">
      <Userpic />
      <!-- <Notification /> -->
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import Userpic from '@/components/userpic/Userpic';
// import Notification from '@/components/notification/Notification';

export default {
  components: {
    Breadcrumbs,
    Userpic,
    // Notification
  }
}
</script>

<style lang="scss">
  .navigation {
    @include shadow-2();
    background-color: $white;
    height: 6rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1.4rem;
    padding-right: 2.7rem;
    padding-bottom: 1.4rem;
    padding-left: 2.4rem;

    &__wrapper {
      display: flex;
      align-items: center;
    }
  }

  
</style>