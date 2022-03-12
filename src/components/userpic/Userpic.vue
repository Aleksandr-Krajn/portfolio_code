<template>
  <div class="userpic" v-if="user">
    <div class="userpic__employee">
      <p class="userpic__name font-xs">{{ info.name }}</p>
  
      <p class="userpic__position font-xs">{{ info.role }}</p>
    </div>

    <el-menu mode="horizontal">
      <el-submenu index="2">
        <template slot="title">
          <span class="userpic__avatar font-sm">{{ info.textImage }}</span>
        </template>
       
          <div class="userpic__drop-down">
            <div class="userpic__wrapper">
              <p class="userpic__title font-lg">
                {{ $t('message.common.menu.profile') }}
              </p>

              <div class="userpic__profile">
                <span class="userpic__avatar font-sm">{{ info.textImage }}</span>

                <div class="userpic__employee userpic__employee--profile">

                  <p class="userpic__name font-xs">{{ info.name }}</p>
              
                  <p class="userpic__position font-xs">
                    {{ info.role }}

                    <span class="userpic__separator">•</span>

                    {{ info.email }}
                  </p>
                </div>
              </div>
            </div>
            <div class="userpic__exit-wrapper" @click="logout">
              <button class="userpic__exit font-sm">
                <IzIcon class="userpic__exit-icon" name="door_icon" library="iz"/>
                {{ $t('message.common.buttons.exit') }}
              </button>
            </div>
          </div>
      
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import authService from '@/services/auth.service';

import { mapState, mapGetters } from 'vuex';

import IzIcon from 'IzElements/icon';

export default {
  name: "Userpic",

  components: {
    IzIcon,
  },

  computed: {
    ...mapState('Authorization', [
      'user',
    ]),

    ...mapGetters('Authorization', [
      'userRole',
    ]),

    /**
     * Получение отображаемых данных о пользователе
     */
    info() {
      if (this.user) {
        const textImage = this.user.full_name
          .split(' ')
          .reduce((acc, word) => {
            if (word.length && acc.length < 2) {
              acc += word.charAt(0).toUpperCase();
            }
            return acc;
          }, '');
        const role = this.userRole ? this.userRole.title : '';

        return {
          name: this.user.full_name,
          email: this.user.email,
          role,
          textImage,
        }
      }
      return {};
    }
  },

  methods: {
    logout() {
      // Выход
      authService.logout();
      this.$router.replace({ name: 'Authorization' });
    }
  }
}
</script>
<style lang="scss">
.userpic {
  display: flex;
  align-items: center;

  &__employee {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;

    &--profile {
      align-items: flex-start;
      margin: 0.8rem;
    }
  }

  &__name {
    color: $dark-blue-1000;
    font-weight: bold;
    line-height: 130%;
  }

  &__position {
    color: rgb(37, 50, 95, 0.5);
  }

  &__avatar {
    width: 3.2rem;
    height: 3.2rem;
    display: inline-block;
    background: $dark-blue-1000;
    border-radius: 50%;
    text-align: center;
    line-height: 3.3rem;
    vertical-align: middle;
    color: $white;
  }

  &__check sup{
    width: 0.9rem;
    height: 0.9rem;
  }

  .el-icon-arrow-down:before {
    color: $dark-blue-1000;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .el-submenu__title {
    padding-left: 0.8rem;
    padding-right: 0;
  }

  &__drop-down {
    width: 47rem;
    padding-top: 4rem;
    padding-bottom: 2.4rem;
  }

  &__wrapper {
    padding-left: 4rem;
    padding-right: 4rem;
  }

  &__title {
    font-weight: 500;
  }

  &__profile {
    display: flex;
    align-items: center;
    margin-top: 2.8rem;
    margin-bottom: 1.2rem;
  }

  &__exit {
    display: flex;
    align-items: center;
  }

  &__exit-wrapper {
    padding-top: 1.8rem;
    padding-bottom: 1.8rem;
    padding-left: 4.4rem;
    padding-right: 4.4rem;
    transition: 0.5;
    cursor: pointer;
    
    &:hover {
      background: rgba($dark-grey-200, 0.3);
    }
  }

  &__exit-icon {
    margin-right: 0.9rem;
  }
}
</style>