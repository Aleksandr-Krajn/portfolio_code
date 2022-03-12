<template>
  <div class="notification">
    <button @click="isActiveNotification ? closeNotification() : openNotification()">
      <el-badge is-dot class="notification__badge">
        <i class="notification__bell el-icon-bell"></i>
      </el-badge>
    </button>

    <transition name="el-zoom-in-top">
      <div v-show="isActiveNotification" class="notification__dropping">
        <button @click="closeNotification" class="notification__close">
          <i class="el-icon-close"></i>
        </button>

        <p class="notification__title font-lg">
          Уведомления
        </p>

        <!-- Сортировка уведомлений -->
        <div class="notification__tabs">
          <el-radio-group v-model="sortNotification">
            <el-radio-button label="all">Все уведомления</el-radio-button>
            <el-radio-button label="new">Новые</el-radio-button>
            <el-radio-button label="read">Прочитанные</el-radio-button>
          </el-radio-group>
        </div>

        
        <div class="notification__wrapper">
          <!-- Уведомления по дням -->
          <!-- СЕГОДНЯ -->
          <div class="notification__days">

            <!-- Увдомления на определённый день -->
            <div class="notification__date font-sm">
              <span>Сегодня, 5 октября 2021</span>

              <a class="notification__ckeck-read font-sm" href="#">Отметить все как прочитанные</a>
            </div>

            <!-- Список уведомлений на определённый день -->
            <div class="notification__list">

              <div class="notification__item">
                <!-- Заголовок уведомления -->
                <div class="notification__head">
                  <span class="notification__user">
                    KC
                  </span>

                  <p class="notification__text font-xs">Поступила новая заявка на производство № 4958694565 в 14:00</p>
                </div>

                <!-- Тескт уведомления -->
                <div class="notification__body font-sm">
                  Нужны вводы срочно! Нужны вводы срочно! Нужны вводы срочно! Нужны вводы срочно! Нужны вводы срочно! Нужны вводы срочно! Нужны вводы срочно! Нужны вводы срочно! Нужны вводы срочно! 
                </div>
              </div>

              <div class="notification__item">
                <div class="notification__head">
                  <!-- <z-icon class="notification__icon" image="warning" /> -->
                  <p class="notification__text font-xs">Поступила новая заявка на производство № 4958694565 в 14:00</p>
                </div>
              </div>

              <div class="notification__item">
                <div class="notification__head">
                  <!-- <z-icon class="notification__icon" image="success" /> -->
                  <p class="notification__text font-xs">Поступила новая заявка на производство № 4958694565 в 14:00</p>
                </div>
              </div>

            </div>
          </div>

          <!-- ВЧЕРА -->
          <div class="notification__days">
            <!-- Увдомления на определённый день -->
            <div class="notification__date font-sm">
              <span>вчера, 4 октября 2021</span>
            </div>

            <!-- Список уведомлений на определённый день -->
            <div class="notification__list">

              <div class="notification__item">
                <div class="notification__head">
                  <!-- <z-icon class="notification__icon" image="warning" /> -->
                  <p class="notification__text font-xs">Поступила новая заявка на производство № 4958694565 в 14:00</p>
                </div>
              </div>

              <div class="notification__item">
                <div class="notification__head">
                  <!-- <z-icon class="notification__icon" image="success" /> -->
                  <p class="notification__text font-xs">Заказ на производство № 4958694565 готов в 13:01</p>
                </div>
              </div>

              <div class="notification__item">
                <div class="notification__head">
                  <!-- <z-icon class="notification__icon" image="success" /> -->
                  <p class="notification__text font-xs">Поступила новая заявка на производство № 4958694565 в 14:00</p>
                </div>
              </div>

              <div class="notification__item">
                <div class="notification__head">
                  <!-- <z-icon class="notification__icon" image="warning" /> -->
                  <p class="notification__text font-xs">Поступила новая заявка на производство № 4958694565 в 14:00</p>
                </div>
              </div>

              <div class="notification__item">
                <div class="notification__head">
                  <!-- <z-icon class="notification__icon" image="warning" /> -->
                  <p class="notification__text font-xs">Поступила новая заявка на производство № 4958694565 в 14:00</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="notification__setting">
          <button class="notification__setting-button font-sm">
            <i class="el-icon-setting"></i>
            Настройка уведомлений
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'notification',

  data() {
    return {
      sortNotification: 'all',
      isActiveNotification: false
    }
  },

  methods: {
    openNotification() {
      this.isActiveNotification = true
    },

    closeNotification() {
      this.isActiveNotification = false
    }
  }
}
</script>

<style lang="scss">
  .notification {
    margin-left: 2.5rem;
    height: 6rem;
    position: relative;
    display: flex;
    align-items: center;

    &__close {
      position: absolute;
      right: 1.9rem;
      top: 1.9rem;
      font-size: 1.6rem;
      color: $dark-grey-1000;
      padding: 0.5rem;
    }

    &__dropping {
      @include shadow-3();
      width: 59rem;
      height: calc(100vh - 6rem);
      display: flex;
      flex-direction: column;
      background: $white;
      position: absolute;
      z-index: 999;
      top: 6rem;
      right: -2.7rem;
    }

    &__title {
      padding-left: 4rem;
      padding-right: 4rem;
      margin-top: 4rem;
      font-weight: 500;
      flex: 0 0 auto;
    }

    &__tabs {
      margin-top: 2.5rem;
      padding-left: 4rem;
      padding-right: 4rem;
    }

    &__wrapper {
      padding-left: 4rem;
      padding-right: 4rem;
      margin-top: 2.5rem;
      flex: 1 1 auto;
      overflow-y: scroll;
    }

    &__ckeck-read {
      color: $dark-grey-1000;
      font-weight: 400;
    }

    &__days {      
      margin-bottom: 4rem;
    }

    &__list {
      margin-left: 2.4rem;
    }

    &__date {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2.4rem;
      color: #606266;
      font-weight: bold;

      span {
        text-transform: uppercase;
      }
    }

    &__item {
      margin-bottom: 2.4rem;
    }

    &__head {
      display: flex;
      align-items: center;
    }

    &__body {
      margin-top: 0.8rem;
    }

    &__user {
      width: 3.2rem;
      height: 3.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #1B4F97;
      border-radius: 50%;
      margin-right: 0.8rem;
      color: $white;
      font-size: 1.4rem;
    }

    &__icon {
      margin-right: 1rem;
      display: flex;
      align-items: center;
    }

    &__text {
      font-weight: bold;
      color: $dark-blue-1000;
    }

    &__setting {
      @include shadow-2();
      flex: 0 0 auto;
      background: #FFFFFF;
      padding-top: 1.6rem;
      padding-bottom: 1.6rem;
      padding-left: 6.4rem;
      padding-right: 6.4rem;
      transition: 0.5s;
      
      &:hover {
        background: linear-gradient(0deg, rgba(228, 231, 237, 0.3), rgba(228, 231, 237, 0.3)), #FFFFFF;
      }
    }

    &__setting-button {
      display: flex;
      align-items: center;
      color: #1B4F97;

      .el-icon-setting {
        font-size: 2.4rem;
        margin-right: 1rem;
      }
    }

    &__badge {
      margin-top: 0;
      margin-right: 0;
      & .el-badge__content.is-dot {
        right: 10px;
        top: 6px;
        height: 9px;
        width: 9px;
      }
    }

    &__bell {
      font-size: 24px;
      height: 24px;
      width: 24px;
      color: $dark-blue-1000;
    }
  }
</style>