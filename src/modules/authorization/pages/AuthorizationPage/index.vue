<template>
  <div class="authorization">
    <section class="authorization__img" />

    <div class="authorization__wrapper">
      <img class="authorization__background-logo" src="@/assets/images/authorization/logoBackground.png" alt="">

      <LogoLarge class="authorization__logo" />
      <form
        class="authorization__form"
        @submit.prevent="onSubmit"
      >
        <p class="authorization__name font-lg weight-500">{{ $t('message.auth.authorization') }}</p>
        <div class="authorization__item">
          <IzInput
            v-model="form.login"
            :isError="errors.login_error1 || errors.login_error2"
            :suffix-icon="errors.login_error2 ? 'el-icon-warning' : ''"
            :placeholder="$t('message.auth.userName')"
            @input="changeLogin"
            />
          <p
            v-show="errors.login_error1 || errors.login_error2"
            class="authorization__item__message">
            {{ errors.messages_error1 }}
          </p>
        </div>
        
        <div class="authorization__item authorization__password">
          <IzInput
            v-model="form.password"
            :isError="errors.password_error1 || errors.password_error2"
            :suffix-icon="errors.password_error2 ? 'el-icon-warning' : ''"
            type="password"
            :placeholder="$t('message.auth.password')"
            :show-password="!errors.password_error2"
            @keydown.native.space.prevent
            @paste.native.prevent="pastePassword"
            @input="changePassword" />
          <p
            v-show="errors.password_error1 || errors.password_error2"
            class="authorization__item__message">
            {{ errors.messages_error2 }}
          </p>
        </div>

        <z-btn className="authorization__submit" :disabled="!disabledSubmit">{{ $t('message.auth.login') }}</z-btn>
        
        <a
          @click.prevent="recoveryPassword"
          href="#"
          class="authorization__recovery-password font-sm">
          {{ $t('message.auth.forgotQuestion') }}
        </a>
      </form>

      <div class="authorization__support">
        <p class="authorization__departament font-sm">{{ $t('message.common.supportInfo.departament') }}</p>
        <p class="font-sm">{{ $t('message.common.supportInfo.phone') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { authService } from '@/services/auth.service';

import LogoLarge from "@/assets/images/logo-large.svg";
import IzInput from "IzElements/inputs/input";

export default {
  name: "Authorization",

  components: {
    LogoLarge,
    IzInput,
  },

  computed : {
    disabledSubmit () {
      return Boolean(this.form.login.trim() && this.form.password.trim());
    }
  },

  data () {
    return {
      form: {
        login: '',
        password: ''
      },
      errors: {
        login_error1: false,
        login_error2: false,
        messages_error1: '',
        password_error1: false,
        password_error2: false,
        messages_error2: ''
      }
    }
  },

  created() {
    this.resetUser();
  },

  methods: {
    ...mapActions('Authorization', [
      'resetUser',
    ]),

    onSubmit() {
      if(this.validataion()) {
        return false
      }

      let requestAuth = authService.login(this.form.login.trim(), this.form.password.trim())

      requestAuth
      .then(() => {
        this.$router.push('/administration')

      }).catch(err => {
        if (err.response) {
          const detail = err.response.status === 400
            ? "Неверный логин или пароль"
            : err.response.data.detail;

          this.errorLogin(detail);
        }
      })
    },

    changeLogin() {
      this.clearLoginError()
    },

    changePassword(value) {
      this.form.password = value.split(/[\s\t\n]/ig).join('');
      this.clearPasswordError()
    },

    validataion() {
      this.clearLoginError()
      this.clearPasswordError()

      let hasError = false

      if(this.form.login.trim().length < 5) {
        this.errors.login_error2 = true
        this.errors.messages_error1 = this.$t('message.auth.validataion.minLength');
        hasError = true
      }

      if(this.form.password.trim().length < 5) {
        this.errors.password_error2 = true
        this.errors.messages_error2 = this.$t('message.auth.validataion.minLength');
        hasError = true
      }

      return hasError
    },

    clearLoginError() {
        this.errors.login_error1 = false
        this.errors.login_error2 = false
        this.errors.messages_error1 = ''
    },

    clearPasswordError() {
        this.errors.password_error1 = false
        this.errors.password_error2 = false
        this.errors.messages_error2 = ''
    },

    errorLogin(message) {
      this.errors.login_error2 = true;
      this.errors.password_error2 = true;
      this.errors.messages_error2 = message
    },

    recoveryPassword() {
      window.bslNotice({
        type: 'warning',
        data: {
          title: this.$t('message.common.notice.attention'),
          message: this.$t('message.auth.validataion.reset_password'),
        }
      });
    },

    /**
     * Очищаем поле пароля при вставке от символов разделителей
     */
    pastePassword(event) {
      var clipboardData = event.clipboardData || event.originalEvent.clipboardData || window.clipboardData;
      var pastedData = clipboardData.getData('text');
      const value = pastedData.split(/[\s\t\n]/ig).join('');
      this.form.password = value;
    }
  }
}
</script>

<style lang="scss">
  .authorization {
    display: flex;
    width: 100%;
    height: 100vh;

    &__img {
      width: 50%;
      background-image: url('~@/assets/images/izolyator1.jpg');
      background-size: cover;
    }

    &__alerts {
      position: absolute;
      top: 33rem;
      z-index: 9;
    }

    &__wrapper {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      margin-top: -301px;
    }

    &__logo {
      width: 321px;
      height: 183px;
    }

    &__background-logo {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 75%;
      object-fit: cover;
      z-index: -1;
    }

    &__form {
      margin-top: 118px;
      width: 300px;
      position: relative;
    }

    &__name {
      text-align: center;
      margin-bottom: 2.4rem;

      font-weight: 500;
      font-size: 24px;
      line-height: 35px;
    }

    &__item {
      margin-bottom: 0.8rem;

      input {
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        outline: none;
      }

      .el-icon-warning {
        font-size: 20px;
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }

      &__message {
        font-weight: normal;
        font-size: 12px;
        margin-top: 2px;
        line-height: 1;
        color: $red-1000;
      }
    }

    &__submit {
      width: 100%;
      margin-top: 1.6rem;

      font-weight: 500;
      font-size: 14px;
    }

    &__recovery-password {
      display: block;
      margin-top: 0.8rem;
      text-align: center;
      color: $dark-blue-1000;
      line-height: 1.8rem;

      font-weight: normal;
      font-size: 14px;
      &:hover {
        color: $light-blue-1000;
      }
    }

    &__support {
      position: absolute;
      text-align: right;
      bottom: 3.7rem;
      right: 4rem;

      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
    }

    &__departament {
      margin-bottom: 4px;
    }

    &__password {
      .z-input__password-button {
        height: 14px;
        cursor: pointer;
        .z-input__password-icon {
          font-size: 1.4rem;
          display: block;
        }
      }
    }
  }
</style>