<template>
	<div class="content-wrapper">
		<section>
			<div class="container login-container">
				<transition name="animation-message">
					<div class="ui-message ui-message--danger" id="exampleMessage" v-if="messageToggle">
						<span class="message-title">{{ msg }}</span>
					</div>
				</transition>
				<vue-topprogress ref="topProgress"></vue-topprogress>
				<div class="auth">
					<div class="auth__form">
						<span class="ui-title-2">Войти</span>
						<form @submit.prevent="onSubmit">
							<div class="form-item" :class="{ errorInput: $v.email.$error }">
								<input type="email" placeholder="Почта" v-model="email"
								       :class="{ formError: $v.email.$error }" @change="$v.email.$touch()">
								<div class="error" v-if="!$v.email.required">Поле не заполнено</div>
								<div class="error" v-if="!$v.email.email">Почта некорректна</div>
							</div>
							<div class="form-item" :class="{ errorInput: $v.password.$error }">
								<input type="password" autocomplete="on" placeholder="Пароль" v-model="password"
								       :class="{ formError: $v.password.$error }" @change="$v.password.$touch()">
								<div class="error" v-if="!$v.password.required">Пароль не заполнен</div>
								<div class="error" v-if="!$v.password.minLength">Пароль не должен быть короче {{
									$v.password.$params.minLength.min }} знаков.
								</div>
							</div>
							<div class="buttons-list">
								<button class="button button-primary" type="submit">
									<span>Войти</span>
								</button>
							</div>
						</form>
					</div>
				</div>
				<div class="buttons-list--info">
					<span>Еще нет аккаунта?</span>
					<router-link to="/registration" class="blue-link">Нажмите сюда</router-link>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	import {email, minLength, required} from 'vuelidate/lib/validators'
	import { vueTopprogress } from 'vue-top-progress'
	export default {
		components: {
			vueTopprogress
		},
		data () {
			return {
				email: '',
				password: '',
				submitStatus: null,
				messageToggle: false,
				msg: null,
				userdata: null
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
			}
		},
		watch: {
			'loading': {
				handler (val, oldVal) {
					if (val === true) {
						this.$refs.topProgress.start()
					} else if (val === false) {
						this.$refs.topProgress.done()
						if (this.$session.has('user')) {
							this.$router.push('/')
						}
					}
				}
			},
			'user': {
				handler (val, oldVal) {
					if (val !== null) {
						this.userdata = true
					} else if (val === null) {
						this.userdata = false
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
					this.$store.dispatch('loginUser', user)
					.then(() => {
						this.$session.start()
						this.$session.set('user', this.user)
						this.submitStatus = 'OK'
						this.$router.push('/')
					})
					.catch(err => {
						this.msg = err.message
						this.submitStatus = err.message
						this.showMessage('ошибка аутентификации')
					})
				}
			},
			showMessage (msg) {
				this.messageToggle = true
				this.msg = msg
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
				return this.$store.state.user
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

	.login-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.auth__form {
		width: 100%;
	}

	.button-primary {
		width: 100%;
		border-radius: 0.6em;
	}

	.link-link {
		color: #444ce0;
		cursor: pointer;
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
