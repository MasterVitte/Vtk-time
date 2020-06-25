<template>
    <div class="content-wrapper">
        <section>
            <div class="container registration-container">
                <transition name="animation-message">
                    <div class="ui-message ui-message--danger" id="exampleMessage" v-show="messageToggle">
                        <span class="message-title">{{ msg }}</span>
                    </div>
                </transition>
                <vue-topprogress ref="topProgress"></vue-topprogress>
                <div class="auth">
                    <div class="auth__form">
                        <span class="ui-title-2">Регистрация</span>
                        <form @submit.prevent="onSubmit">
                            <div class="form-item" :class="{ errorInput: $v.email.$error }">
                                <input type="email" placeholder="Почта" v-model="email"
                                       :class="{ formError: $v.email.$error }" @change="$v.email.$touch()">
                                <div class="error" v-if="!$v.email.required">Поле не заполнено</div>
                                <div class="error" v-if="!$v.email.email">Почта некорректна</div>
                            </div>
                            <div class="form-item" :class="{ errorInput: $v.password.$error }">
                                <input type="password" placeholder="Пароль" v-model="password"
                                       :class="{ formError: $v.password.$error }" @change="$v.password.$touch()">
                                <div class="error" v-if="!$v.password.required">Пароль не заполнен</div>
                                <div class="error" v-if="!$v.password.minLength">Пароль не должен быть короче {{
                                    $v.password.$params.minLength.min }} знаков.
                                </div>
                            </div>
                            <div class="form-item" :class="{ errorInput: $v.repeatPassword.$error }">
                                <input type="password" placeholder="Повторите пароль" v-model="repeatPassword"
                                       :class="{ formError: $v.repeatPassword.$error }"
                                       @change="$v.repeatPassword.$touch()">
                                <div class="error" v-if="!$v.repeatPassword.sameAsPassword">Пароли не совпадают</div>
                            </div>
                            <div class="buttons-list">
                                <button class="button button-primary" type="submit">
                                    <span>Регистрация</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="buttons-list--info">
                    <span>Уже есть аккаунт?</span>
                    <router-link to="/login" class="blue-link">Нажмите сюда</router-link>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import {email, minLength, required, sameAs} from 'vuelidate/lib/validators'
import { vueTopprogress } from 'vue-top-progress'
export default {
  components: {
    vueTopprogress
  },
  data () {
    return {
      email: '',
      password: '',
      repeatPassword: '',
      submitStatus: null,
      messageToggle: false,
      msg: null
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6)
    },
    repeatPassword: {
      sameAsPassword: sameAs('password')
    }
  },
  watch: {
    'loading': {
      handler (val, oldVal) {
        if (val === true) {
          this.$refs.topProgress.start()
        } else if (val === false) {
          this.$refs.topProgress.done()
        }
      }
    }
  },
  methods: {
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        const user = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('registerUser', user)
          .then(() => {
            // console.log('REGISTER!')
            this.submitStatus = 'OK!'
            this.$router.push('/')
          })
          .catch(err => {
            this.submitStatus = err.message
            this.showMessage()
            this.msg = this.submitStatus
          })
      }
    },
    showMessage () {
      this.messageToggle = true
      let self = this
      setTimeout(function () {
        self.hideMessage()
      }, 3000)
    },
    hideMessage () {
      this.messageToggle = false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    user () {
      return this.$store.getters.user
    }
  }
}
</script>

<style scoped>

    @import '../../assets/styles/index.css';

    .auth {
        display: flex;
        width: 50%;
        border: 1px solid #dcdcdc;
        padding: 30px;
    }

    .registration-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .button-primary {
        width: 100%;
    }

    .buttons-list--info {
        text-align: center;
        margin: 20px 0;
        padding: 30px;
        width: 50%;
        border: 1px solid #dcdcdc;
    }

    .auth__form {
        width: 100%;
    }

    .form-item .error {
        display: none;
        font-size: 13px;
        color: #fc5c65;
        margin-bottom: 8px;
    }

    .errorInput .error {
        display: block;
    }

    .form-item .formError {
        border-color: #fc5c65;
        color: #fc5c65;
        margin-bottom: 8px;
    }

    .buttons-list {
        text-align: right;
        margin-bottom: 20px;
    }

    .buttons-list--info {
        text-align: center;
        margin: 20px 0;
        padding: 30px;
        width: 50%;
        border: 1px solid #dcdcdc;
    }

    .buttons-list--info p {
        text-align: center;
        margin-bottom: 20px;
    }

    .buttons-list--info:last-child {
        margin-bottom: 0;
    }

    a {
        color: #444ce0;
    }

    @media all and (max-width: 768px) {
        .auth,
        .buttons-list--info {
            width: 80%;
        }
    }

</style>
