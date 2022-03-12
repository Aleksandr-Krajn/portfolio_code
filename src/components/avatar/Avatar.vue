<template>
  <div class="avatar">
    <el-badge is-dot class="avatar__check">
      <i class="avatar__bell el-icon-bell"></i>
    </el-badge>
    
  </div>
</template>


<style lang="scss">
  .avatar {
    &__bell {
      font-size: 1.8rem;
      color: $dark-blue-1000;
    }

    &__check sup{
      width: 0.9rem;
      height: 0.9rem;
    }
  }
</style>