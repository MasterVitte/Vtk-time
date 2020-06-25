<template>
	<div class="content-wrapper">
		<section>
			<div class="container">
				<!--Прогресс-бар-->
				<vue-topprogress ref="topProgress"></vue-topprogress>
				<div class="department-container-content">
					<div class="department-list__header">
						<!--Кнопка добавить-->
						<div class="button-add"><span @click="departmentAdd()"></span></div>
						<!--Заголовок-->
						<h1 class="ui-title-1">Отделение</h1>
					</div>
					<div class="department-list">
						<!--Список элементов-->
						<div class="department-item" v-for="department in departments" :key="department.id"
						     @click="activeDepartment = department">
							<div class="ui-card ui-card--shadow">
								<div class="department-item__content">
									<div class="department-item__header row grid-reverse">
										<div class="department-item__info col-md-2 col-xs-12 no-padding">
											<span class="button-edit" @click="departmentEdit(department.id, department.title)"></span>
											<span class="button-close" @click="departmentDelete(department.id)"></span>
										</div>
										<div class="department-item__title col-md-10 col-xs-12 no-padding">
											<span class="ui-title-3">{{ department.title }}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<transition name="animation-window">
					<div class="ui-messageBox__wrapper" v-if="add" :class="{active: add}"
					     v-on:keyup.esc="cancelDepartmentAdd" v-on:keyup.enter="newDepartment">
						<form @submit.prevent="newDepartment">
							<div class="ui-messageBox">
								<div class="ui-messageBox__header row">
									<div class="col-10 no-padding">
										<span class="messageBox-title">Добавить</span>
									</div>
									<div class="col-2 no-padding justify-content-end">
										<span class="button-close" @click="cancelDepartmentAdd"></span>
									</div>
								</div>
								<div class="ui-messageBox__content">
									<p class="modal__title">Название</p>
									<input type="text" class="modal__input" v-focus v-model="departmentTitle" tabindex="1"
									       :class="{ formError: $v.departmentTitle.$error || dublicate }"
									       @change="$v.departmentTitle.$touch()">
									<div class="error" v-if="!$v.departmentTitle.required">Поле не заполнено</div>
									<div class="error" v-if="dublicate">Найдено совпадение</div>
								</div>
								<div class="ui-messageBox__footer">
									<div class="button button-light" @click="cancelDepartmentAdd" tabindex="2"
									     v-on:keyup.enter="cancelDepartmentAdd">Отмена
									</div>
									<div class="button button-primary" @click="newDepartment" tabindex="3"
									     v-on:keyup.enter="newDepartment">OK
									</div>
								</div>
							</div>
						</form>
					</div>
				</transition>
				<transition name="animation-window">
					<div class="ui-messageBox__wrapper" v-if="editing" :class="{active: editing}"
					     v-on:keyup.esc="cancelDepartmentEdit" v-on:keyup.enter="finishDepartmentEdit">
						<form @submit.prevent="finishDepartmentEdit">
							<div class="ui-messageBox">
								<div class="ui-messageBox__header row">
									<div class="col-10 no-padding">
										<span class="messageBox-title">Изменить</span>
									</div>
									<div class="col-2 no-padding justify-content-end">
										<span class="button-close" @click="cancelDepartmentEdit"></span>
									</div>
								</div>
								<div class="ui-messageBox__content">
									<p class="modal__title">Название</p>
									<input type="text" class="modal__input" v-focus v-model="titleEditing" tabindex="1"
									       :class="{ formError: $v.titleEditing.$error || dublicateEdit }"
									       @change="$v.titleEditing.$touch()">
									<div class="error" v-if="!$v.titleEditing.required">Поле не заполнено</div>
									<div class="error" v-if="dublicateEdit">Найдено совпадение</div>
								</div>
								<div class="ui-messageBox__footer">
									<div class="button button-light" @click="cancelDepartmentEdit" tabindex="2"
									     v-on:keyup.enter="cancelDepartmentEdit">Отмена
									</div>
									<div class="button button-primary" @click="finishDepartmentEdit" tabindex="3"
									     v-on:keyup.enter="finishDepartmentEdit">OK
									</div>
								</div>
							</div>
						</form>
					</div>
				</transition>
				<transition name="animation-window">
					<div class="ui-messageBox__wrapper" v-if="remove" :class="{active: remove}"
					     v-on:keyup.esc="cancelSubjectDelete">
						<form>
							<div class="ui-messageBox">
								<div class="ui-messageBox__header row">
									<div class="col-10 no-padding">
										<span class="messageBox-title">Удалить?</span>
									</div>
									<div class="col-2 no-padding justify-content-end">
										<span class="button-close" @click="cancelDepartmentDelete"></span>
									</div>
								</div>
								<div class="ui-messageBox__content">
									<p class="modal__title">Название: {{activeDepartment.title}}</p>
								</div>
								<div class="ui-messageBox__footer">
									<div class="button button-light" @click="cancelDepartmentDelete" tabindex="6"
									     v-on:keyup.enter="cancelDepartmentEdit">Отмена
									</div>
									<div class="button button-primary" @click="finishDepartmentDelete(activeDepartment.id)" tabindex="7"
									     v-on:keyup.enter="finishDepartmentDelete(activeDepartment.id)">OK
									</div>
								</div>
							</div>
						</form>
					</div>
				</transition>
			</div>
		</section>
	</div>
</template>

<script>
	import {required} from 'vuelidate/lib/validators'
	import {vueTopprogress} from 'vue-top-progress'

	export default {
		components: {
			vueTopprogress
		},
		data() {
			return {
				activeDepartment: '',
				departmentTitle: '',
				add: false,
				editing: false,
				remove: false,
				titleEditing: '',
				departmentId: null
			}
		},
    // Валидаторы
		validations: {
			departmentTitle: {
				required
			},
			titleEditing: {
				required
			}
		},
    // Лоад-бар
		watch: {
			'loading': {
				handler(val, oldVal) {
					if (val === true) {
						this.$refs.topProgress.start()
					} else if (val === false) {
						this.$refs.topProgress.done()
					}
				}
			}
		},
    // Коллбэки в другие компоненты
		mounted() {
			let callback = this.$route.params['callback']
			if (callback === 'departmentAdd') {
				this.departmentAdd()
			}
		},
		methods: {
      // Сообщение об ошибке
      showMessage (msg) {
        this.messageToggle = true
        this.msg = msg
        let self = this
        setTimeout(function () {
          self.hideMessage()
        }, 3000)
      },
      // Ф-я скрыть сообщение
      hideMessage () {
        this.messageToggle = false
      },
			// Фикс скролла модальных окон
			fixcontainertrue() {
				document.querySelector('html').style.overflow = 'hidden'
			},
			fixcontainerfalse() {
				document.querySelector('html').style.overflow = 'auto'
			},
			// Открытие модального окна для добавления нового отделения
			departmentAdd() {
				this.add = !this.add
				this.fixcontainertrue()
			},
      // Закрытие модального окна для добавления нового отделения
      cancelDepartmentAdd() {
        this.add = !this.add
        this.departmentTitle = ''
        this.fixcontainerfalse()
        this.activeDepartment = null
      },
      // Создание отделения
			newDepartment() {
				this.$v.$touch()
				if (!this.dublicate && this.roomTitle !== '' && this.departmentTitle !== '') {
					const department = {
						title: this.departmentTitle
					}
					this.$store.dispatch('newDepartment', department)
					this.departmentTitle = ''
					this.add = !this.add
					this.$store.dispatch('loadDepartments')
				}
				this.fixcontainerfalse()
				this.activeDepartment = null
			},
      // Открытие модалки для изменения нового отделения
			departmentEdit(id, title) {
				this.editing = !this.editing
				this.departmentId = id
				this.titleEditing = title
				this.oldTitleEditing = title
				this.fixcontainertrue()
			},
      // Закрытие модалки для изменения нового отделения
			cancelDepartmentEdit() {
				this.editing = !this.editing
				this.departmentId = null
				this.titleEditing = ''
				this.fixcontainerfalse()
				this.activeDepartment = null
			},
      // Открытие модалки для подтверждения изменения отделения
			finishDepartmentEdit() {
				this.$v.$touch()
				if (!this.dublicateEdit) {
					this.$store.dispatch('editDepartment', {
						id: this.departmentId,
						title: this.titleEditing
					})
					this.editing = !this.editing
					this.$store.dispatch('loadDepartments')
				}
				this.fixcontainerfalse()
			},
      // Открытие модалки для удаления отделения
			departmentDelete() {
				this.remove = true
				this.fixcontainertrue()
			},
      // Закрытие модалки для удаления отделения
      cancelDepartmentDelete() {
        this.remove = false
        this.fixcontainerfalse()
      },
      // Открытие модалки для подтверждения удаления отделения
			finishDepartmentDelete(id) {
				this.$store.dispatch('deleteDepartment', id)
				this.$store.dispatch('loadDepartments')
				this.fixcontainerfalse()
				this.remove = false
			},
		},
		computed: {
			departments() {
				return this.$store.getters.departments
			},
      dependencies() {
        return this.$store.getters.dependencies
      },
			specialtyes() {
				return this.$store.getters.specialtyes
			},
			loading() {
				return this.$store.getters.loading
			},
			// Поиск дубликатов при создании
			dublicate() {
				for (let i = 0; i < this.departments.length; i++) {
					if (this.departments[i].title === (this.departmentTitle).trim()) {
						return true
					}
				}
				return false
			},
			// Поиск дубликатов при редактировании
			dublicateEdit() {
				for (let i = 0; i < this.departments.length; i++) {
					if (this.departments[i].title === (this.titleEditing).trim() && this.departments[i].title !== this.oldTitleEditing) {
						return true
					}
				}
				return false
			}
		},
		directives: {
			focus: {
				inserted: function (el) {
					el.focus()
				}
			}
		}
	}
</script>

<style scoped>
	@import '../assets/styles/index.css';
	.department-item {
		margin-bottom: 20px;
	}
	.department-item:last-child {
		margin-bottom: 0;
	}
	.department-item__info {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.department-item__header {
		margin-bottom: 18px !important;
	}
	.department-item__header > span {
		margin-bottom: 0;
	}
	.ui-title-1 {
		margin-bottom: 0;
	}
	.department-list__header {
		display: flex;
		margin-bottom: 20px;
		flex-direction: column;
	}
	.formError {
		border-color: #fc5c65;
		color: #fc5c65;
		margin-bottom: 8px;
	}
	.department-item__title {
		word-break: break-all;
	}
	.error {
		display: none;
		font-size: 13px;
		color: #fc5c65;
		margin-bottom: 8px;
	}
	.formError + .error {
		display: block;
	}
	.department-item__header {
		display: flex;
		justify-content: space-between;
	}
	.department-item__info span {
		margin-right: 20px;
	}
	.department-item__info span:last-child {
		margin-right: 0;
	}
	@media all and (max-width: 768px) {
		.ui-title-1,
		.empty {
			text-align: center;
		}
	}
</style>
