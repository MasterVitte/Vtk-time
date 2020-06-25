<template>
    <div class="content-wrapper">
        <section>
            <div class="container">
              <transition name="animation-message">
                <div class="ui-message ui-message--danger" id="exampleMessage" v-if="messageToggle">
                  <span class="message-title">{{ msg }}</span>
                </div>
              </transition>
                <vue-topprogress ref="topProgress"></vue-topprogress>
                <div class="specialty-container-content">
                    <div class="specialty-list__header">
                        <div class="button-add"><span @click="specialtyAdd()"></span></div>
                        <h1 class="ui-title-1">Специальность</h1>
                    </div>
                    <div class="specialty-list">
                        <div class="specialty-item" v-for="specialty in specialtyes" :key="specialty.id" @click="activeSpecialty = specialty">
                            <div class="ui-card ui-card--shadow">
                                <div class="specialty-item__content">
                                    <div class="specialty-item__header row grid-reverse">
                                        <div class="specialty-item__info col-md-2 col-xs-12 no-padding">
                                            <span class="button-edit"
                                                  @click="specialtyEdit(specialty, specialty.id, specialty.title)"></span>
                                            <span class="button-close" @click="specialtyDelete(specialty)"></span>
                                        </div>
                                        <div class="specialty-item__title col-md-10 col-xs-12 no-padding">
                                            <span class="ui-title-3">{{ specialty.title }}</span>
                                        </div>
                                    </div>
                                    <!--<div class="ui-tag__wrapper" v-for="specialtyitem in specialty.department"-->
                                         <!--:key="specialtyitem.id">-->
                                        <!--<div class="ui-tag"><span class="tag-title">{{ specialtyitem.title }}</span></div>-->
                                    <!--</div>-->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <transition name="animation-window">
                    <div class="ui-messageBox__wrapper" v-if="add" :class="{active: add}"
                         v-on:keyup.esc="cancelSpecialtyAdd" v-on:keyup.enter="newSpecialty">
                        <form @submit.prevent="newSpecialty">
                            <div class="ui-messageBox">
                                <div class="ui-messageBox__header row">
                                    <div class="col-10 no-padding">
                                        <span class="messageBox-title">Добавить</span>
                                    </div>
                                    <div class="col-2 no-padding justify-content-end">
                                        <span class="button-close" @click="cancelSpecialtyAdd"></span>
                                    </div>
                                </div>
                                <div class="ui-messageBox__content">
                                    <p class="modal__title">Название</p>
                                    <input type="text" class="modal__input" v-model="specialtyTitle" tabindex="1"
                                           :class="{ formError: $v.specialtyTitle.$error || dublicate }"
                                           @change="$v.specialtyTitle.$touch()">
                                    <div class="error" v-if="!$v.specialtyTitle.required">Поле не заполнено</div>
                                    <div class="error" v-if="dublicate">Найдено совпадение</div>
                                    <p class="modal__title">Отделение</p>
                                    <div class="tag-list tag-list-tags row">
                                        <div class="ui-tag__wrapper col-xs-12 col-sm-6 col-md-6 col-lg-6" v-for="department in departments"
                                             :key="department.id">
                                            <div class="ui-tag" @click="editDepartmentUsed(department)"
                                                 @keyup.enter="editDepartmentUsed(department)"
                                                 :class="{active: department.use, 'ui-tag-active': department.use}">
                                                <span class="tag-title">{{ department.title }}</span>
                                            </div>
                                        </div>
                                        <div v-if="!departments || departments.length < 1" class="empty__dependence" @click="awayNewDepartment">
                                            <div class="button-add no-margin"><span></span></div>
                                            <span class="pointer">создать</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="ui-messageBox__footer">
                                    <div class="button button-light" @click="cancelSpecialtyAdd" tabindex="3"
                                         v-on:keyup.enter="cancelSpecialtyAdd">Отмена
                                    </div>
                                    <div class="button button-primary" @click="newSpecialty" tabindex="4"
                                         v-on:keyup.enter="newSpecialty">OK
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </transition>
                <transition name="animation-window">
                    <div class="ui-messageBox__wrapper" v-if="editing" :class="{active: editing}"
                         v-on:keyup.esc="cancelSpecialtyEdit" v-on:keyup.enter="finishSpecialtyEdit">
                        <form @submit.prevent="finishSpecialtyEdit">
                            <div class="ui-messageBox">
                                <div class="ui-messageBox__header row">
                                    <div class="col-10 no-padding">
                                        <span class="messageBox-title">Изменить</span>
                                    </div>
                                    <div class="col-2 no-padding justify-content-end">
                                        <span class="button-close" @click="cancelSpecialtyEdit"></span>
                                    </div>
                                </div>
                                <div class="ui-messageBox__content">
                                    <p class="modal__title">Название</p>
                                    <input type="text" class="modal__input" v-model="titleEditing" tabindex="1"
                                           :class="{ formError: $v.titleEditing.$error || dublicateEdit }"
                                           @change="$v.titleEditing.$touch()">
                                    <div class="error" v-if="!$v.titleEditing.required">Поле не заполнено</div>
                                    <div class="error" v-if="dublicateEdit">Найдено совпадение</div>
                                    <p class="modal__title">Отделение</p>
                                    <div v-if="departments.length > 0">
                                        <div class="tag-list tag-list-tags row">
                                            <div class="ui-tag__wrapper col-xs-12 col-sm-6 col-md-6 col-lg-6" v-for="department in departments"
                                                 :key="department.id">
                                                <div class="ui-tag" @click="editDepartmentUsed(department)"
                                                     @keyup.enter="editDepartmentUsed(department)"
                                                     :class="{active: department.use, 'ui-tag-active': department.use}">
                                                    <span class="tag-title">{{ department.title }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="!departments || departments.length < 1" class="empty__dependence" @click="awayNewDepartment">
                                      <div class="button-add no-margin"><span></span></div>
                                      <span class="pointer">создать</span>
                                    </div>
                                </div>
                                <div class="ui-messageBox__footer">
                                    <div class="button button-light" @click="cancelSpecialtyEdit" tabindex="3"
                                         v-on:keyup.enter="cancelSpecialtyEdit">Отмена
                                    </div>
                                    <div class="button button-primary" @click="finishSpecialtyEdit" tabindex="4"
                                         v-on:keyup.enter="finishSpecialtyEdit">OK
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </transition>
              <transition name="animation-window">
                <div class="ui-messageBox__wrapper" v-if="remove" :class="{active: remove}"
                     v-on:keyup.esc="cancelSpecialtyDelete">
                  <form>
                    <div class="ui-messageBox">
                      <div class="ui-messageBox__header row">
                        <div class="col-10 no-padding">
                          <span class="messageBox-title">Удалить?</span>
                        </div>
                        <div class="col-2 no-padding justify-content-end">
                          <span class="button-close" @click="cancelSpecialtyDelete"></span>
                        </div>
                      </div>
                      <div class="ui-messageBox__content">
                        <p class="modal__title">Название: {{activeSpecialty.title}}</p>
                      </div>
                      <div class="ui-messageBox__footer">
                        <div class="button button-light" @click="cancelSpecialtyDelete" tabindex="6"
                             v-on:keyup.enter="cancelDepartmentEdit">Отмена
                        </div>
                        <div class="button button-primary" @click="finishSpecialtyDelete(activeSpecialty.id)" tabindex="7"
                             v-on:keyup.enter="finishSpecialtyDelete(activeSpecialty.id)">OK
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
import { vueTopprogress } from 'vue-top-progress'

export default {
  components: {
    vueTopprogress
  },
  data () {
    return {
	    specialtyId: '',
	    activeSpecialty: null,
	    specialtyTitle: '',
      departmentUsed: null,
      add: false,
      editing: false,
      remove: false,
      titleEditing: '',
      oldTitleEditing: '',
      impossibleSpecialty: false,
      messageToggle: false,
      msg: null
    }
  },
  // Валидаторы
  validations: {
    specialtyTitle: {
      required
    },
    titleEditing: {
      required
    }
  },
  // Лоад-бар
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
  // Коллбэки в другие компоненты
  mounted () {
    let callback = this.$route.params['callback']
    if (callback === 'specialtyAdd') {
      this.specialtyAdd()
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
    fixcontainertrue () {
      document.querySelector('html').style.overflow = 'hidden'
    },
    fixcontainerfalse () {
      document.querySelector('html').style.overflow = 'auto'
    },
    // Отправка коллбэка в компонент отделения на создание нового отделения
    awayNewDepartment: function () {
      this.add = !this.add
      const callback = 'departmentAdd'
      this.$router.push({ name: 'department', params: { callback } })
    },
    // Открытие модалки для добавления новой специальности
    specialtyAdd () {
      this.add = !this.add
      this.fixcontainertrue()
    },
    // Закрытие модалки для добавления новой специальности
    cancelSpecialtyAdd () {
      this.add = !this.add
      this.specialtyTitle = ''
      this.departmentUsed = null
      this.fixDepartments()
      this.fixcontainerfalse()
    },
    // Создание специальности
    newSpecialty () {
      this.$v.$touch()
      if (!this.dublicate && this.specialtyTitle !== '') {
        if (!this.departmentUsed) {
          this.impossibleSpecialty = true
          this.showMessage('выберите отделение')
        } else {
          this.impossibleSpecialty = false
        }
        if (!this.impossibleSpecialty) {

        	const specialtyObj = {
        		title: this.specialtyTitle
	        }

          this.$store.dispatch('newSpecialty', specialtyObj)

          const specialty = this.specialtyTitle
          const department = this.departmentUsed

          const dependenceObj = {
            specialty: specialty,
            department_id: department
          }

          this.$store.dispatch('newDependence', dependenceObj)

          //  Reset
          this.specialtyTitle = ''
          this.add = !this.add
        }
	      this.fixDepartments()
        this.fixcontainerfalse()

        this.$store.dispatch('loadDepartments')
        this.$store.dispatch('loadSpecialtyes')
        this.$store.dispatch('loadDependencies')
      }
    },
    // Открытие модалки для изменения специальности
    specialtyEdit (active, id, title) {
      this.editing = !this.editing
      this.specialtyId = id
	    this.activeSpecialty = active
      this.titleEditing = this.oldTitleEditing = title

      try {

        // Поиск зависимости
        for (let dependence in this.dependencies) {
          const specialty = this.dependencies[dependence].specialty
          const department = this.dependencies[dependence].department_id
          if (specialty === this.oldTitleEditing) {

            for (let dep in this.departments) {
              if (department === this.departments[dep].id) {
                this.departmentUsed = this.departments[dep].id
                this.departments[dep].use = true
              }
            }

          }
        }

      } catch (error) {
        console.log(error)
      }

      this.fixcontainertrue()
    },
    // Закрытие модалки для изменения новой специальности
    cancelSpecialtyEdit () {
      this.editing = !this.editing
	    this.activeSpecialty = null
      this.specialtyId = ''
      this.titleEditing = ''
	    this.departmentUsed = ''
	    this.fixDepartments()
      this.fixcontainerfalse()
    },
    // Открытие модалки для подтверждения изменения специальности
    finishSpecialtyEdit () {
      this.$v.$touch()
      if (!this.dublicateEdit) {
        if (!this.departmentUsed) {
          this.impossibleSpecialty = true
          this.showMessage('выберите отделение')
        } else {
          this.impossibleSpecialty = false
        }
        if (!this.impossibleSpecialty) {

          this.$store.dispatch('editSpecialty', {
            id: this.specialtyId,
            title: this.titleEditing
          })

			    const id = this.specialtyId
	        const specialty = this.titleEditing
	        const department = this.departmentUsed

          this.editing = !this.editing
	        this.activeSpecialty = null
        }
	      this.fixDepartments()
        this.fixcontainerfalse()

        this.$store.dispatch('loadDepartments')
        this.$store.dispatch('loadSpecialtyes')
        this.$store.dispatch('loadDependencies')
      }
    },
    // Открытие модалки для удаления новой специальности
    specialtyDelete (specialty) {
      this.remove = true
      this.activeSpecialty = specialty
      this.fixcontainertrue()
    },
    // Закрытие модалки для удаления специальности
    cancelSpecialtyDelete () {
      this.remove = false
      this.activeSpecialty = null
      this.fixcontainerfalse()
    },
    // Открытие модалки для подтверждения удаления специальности
    finishSpecialtyDelete (id) {
      this.$store.dispatch('deleteSpecialty', id)
      this.fixcontainerfalse()
	    this.activeSpecialty = null
      this.remove = false

      this.$store.dispatch('loadDepartments')
      this.$store.dispatch('loadSpecialtyes')
      this.$store.dispatch('loadDependencies')
    },
	  // Выбор активного отделения
    editDepartmentUsed (department) {
      this.fixDepartments()
      this.departmentUsed = null
      department.use = !department.use
      if (department.use) {
        this.departmentUsed = department.id
      } else {
        this.departmentUsed = null
      }
    },
	  // Сброс активного отделения
    fixDepartments () {
      for (let dep in this.departments) {
        this.departments[dep].use = false
      }
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    specialtyes () {
      return this.$store.getters.specialtyes
    },
    dependencies() {
      return this.$store.getters.dependencies
    },
    departments () {
      return this.$store.getters.departments
    },
	  // Поиск дубликатов при создании
	  dublicate() {
		  for (let i = 0; i < this.specialtyes.length; i++) {
			  if (this.specialtyes[i].title === (this.specialtyTitle).trim()) {
				  return true
			  }
		  }
		  return false
	  },
	  // Поиск дубликатов при редактировании
	  dublicateEdit() {
		  for (let i = 0; i < this.specialtyes.length; i++) {
			  if (this.specialtyes[i].title === (this.titleEditing).trim() && this.specialtyes[i].title !== this.oldTitleEditing) {
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

    .container {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }

    #exampleMessage {
      align-self: center;
    }

    .ui-message {
      z-index: 10000;
      border: none !important;
    }

    .specialty-list__header {
        display: flex;
        margin-bottom: 20px;
        flex-direction: column;
    }

    .specialty-item {
        margin-bottom: 20px;
    }

    .specialty-item:last-child {
        margin-bottom: 0px;
    }

    .specialty-item__title {
        word-break: break-all;
    }

    .specialty-item__info {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .specialty-item__header {
        margin-bottom: 18px !important;
    }

    .specialty-item__header > span {
        margin-bottom: 0;
    }

    .formError {
        border-color: #fc5c65;
        color: #fc5c65;
        margin-bottom: 8px;
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

    .specialty-item__info span {
        margin-right: 20px;
    }

    .specialty-item__info span:last-child {
        margin-right: 0;
    }

    .ui-tag__wrapper {
        cursor: pointer;
        padding-left: 0;
        word-break: break-all;
    }

    .ui-title-1 {
        margin-bottom: 0;
    }

    @media all and (max-width: 768px) {
        .ui-title-1,
        .empty {
            text-align: center;
        }
        .specialty-item__info {
            margin-bottom: 20px;
        }
    }
</style>
