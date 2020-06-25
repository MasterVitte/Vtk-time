<template>
    <div class="content-wrapper">
        <section>
            <div class="container education-container">
                <vue-topprogress ref="topProgress"></vue-topprogress>
                <div class="education-container-content">
                    <div class="education-list__header">
                        <div class="button-add"><span @click="educationAdd()"></span></div>
                        <h1 class="ui-title-1">Образование</h1>
                    </div>
                    <div class="education-list">
                        <div class="education-item" v-for="education in educations" :key="education.id" @click="activeEducation = education">
                            <div class="ui-card ui-card--shadow">
                                <div class="education-item__content">
                                    <div class="education-item__header row grid-reverse">
                                        <div class="education-item__info col-md-2 col-xs-12 no-padding">
                                            <span class="button-edit"
                                                  @click="educationEdit(education.id, education.title)"></span>
                                            <span class="button-close" @click="educationDelete(education)"></span>
                                        </div>
                                        <div class="education-item__title col-md-10 col-xs-12 no-padding">
                                            <span class="ui-title-3">{{ education.title }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <transition name="animation-window">
                    <div class="ui-messageBox__wrapper" v-if="add" :class="{active: add}"
                         v-on:keyup.esc="cancelEducationAdd" v-on:keyup.enter="newEducation">
                        <form @submit.prevent="newEducation">
                            <div class="ui-messageBox">
                                <div class="ui-messageBox__header row">
                                    <div class="col-10 no-padding">
                                        <span class="messageBox-title">Добавить</span>
                                    </div>
                                    <div class="col-2 no-padding justify-content-end">
                                        <span class="button-close" @click="cancelEducationAdd"></span>
                                    </div>
                                </div>
                                <div class="ui-messageBox__content">
                                    <p class="modal__title">Название</p>
                                    <input type="text" class="modal__input" v-model="educationTitle" tabindex="1"
                                           :class="{ formError: $v.educationTitle.$error || dublicate }"
                                           @change="$v.educationTitle.$touch()">
                                    <div class="error" v-if="!$v.educationTitle.required">Поле не заполнено</div>
                                    <div class="error" v-if="dublicate">Найдено совпадение</div>
                                </div>
                                <div class="ui-messageBox__footer">
                                    <div class="button button-light" @click="cancelEducationAdd" tabindex="2"
                                         v-on:keyup.enter="cancelEducationAdd">Отмена
                                    </div>
                                    <div class="button button-primary" @click="newEducation" tabindex="3"
                                         v-on:keyup.enter="newEducation">OK
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </transition>
                <transition name="animation-window">
                    <div class="ui-messageBox__wrapper" v-if="editing" :class="{active: editing}"
                         v-on:keyup.esc="cancelEducationEdit" v-on:keyup.enter="finishEducationEdit">
                        <form @submit.prevent="finishEducationEdit">
                            <div class="ui-messageBox">
                                <div class="ui-messageBox__header row">
                                    <div class="col-10 no-padding">
                                        <span class="messageBox-title">Изменить</span>
                                    </div>
                                    <div class="col-2 no-padding justify-content-end">
                                        <span class="button-close" @click="cancelEducationEdit"></span>
                                    </div>
                                </div>
                                <div class="ui-messageBox__content">
                                    <p class="modal__title">Название</p>
                                    <input type="text" class="modal__input" v-model="titleEditing" tabindex="1"
                                           :class="{ formError: $v.titleEditing.$error || dublicateEdit }"
                                           @change="$v.titleEditing.$touch()">
                                    <div class="error" v-if="!$v.titleEditing.required">Поле не заполнено</div>
                                    <div class="error" v-if="dublicateEdit">Найдено совпадение</div>
                                </div>
                                <div class="ui-messageBox__footer">
                                    <div class="button button-light" @click="cancelEducationEdit" tabindex="2"
                                         v-on:keyup.enter="cancelEducationEdit">Отмена
                                    </div>
                                    <div class="button button-primary" @click="finishEducationEdit" tabindex="3"
                                         v-on:keyup.enter="finishEducationEdit">OK
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
                        <p class="modal__title">Название: {{activeEducation.title}}</p>
                      </div>
                      <div class="ui-messageBox__footer">
                        <div class="button button-light" @click="cancelEducationDelete" tabindex="6"
                             v-on:keyup.enter="cancelEducationEdit">Отмена
                        </div>
                        <div class="button button-primary" @click="finishEducationDelete(activeEducation.id)" tabindex="7"
                             v-on:keyup.enter="finishEducationDelete(activeEducation.id)">OK
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
      activeEducation: null,
      educationId: null,
      educationTitle: '',
      titleEditing: '',
      oldTitleEditing: '',
      add: false,
      editing: false,
      remove: false
    }
  },
  validations: {
    educationTitle: {
      required
    },
    titleEditing: {
      required
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
  mounted () {
    let callback = this.$route.params['callback']
    if (callback === 'educationAdd') {
      this.educationAdd()
    }
  },
  methods: {
    fixcontainertrue () {
      document.querySelector('html').style.overflow = 'hidden'
    },
    fixcontainerfalse () {
      document.querySelector('html').style.overflow = 'auto'
    },
    newEducation () {
      this.$v.$touch()
      if (!this.dublicate && this.educationTitle !== '') {
        const education = {
          title: this.educationTitle,
          editing: false
        }
        this.$store.dispatch('newEducation', education)
        this.educationTitle = ''
        this.add = !this.add
        this.$store.dispatch('loadEducations')
        this.$store.dispatch('loadTeachers')
        this.fixcontainerfalse()
      }
    },
    educationAdd () {
      this.add = !this.add
      this.fixcontainertrue()
    },
    cancelEducationAdd () {
      this.add = !this.add
      this.educationTitle = ''
      this.fixcontainerfalse()
    },
    educationDelete (education) {
      this.remove = true
      this.activeEducation = education
      this.fixcontainertrue()
    },
    cancelEducationDelete () {
      this.remove = false
      this.fixcontainerfalse()
    },
    educationEdit (id, title) {
      this.editing = !this.editing
      this.educationId = id
      this.titleEditing = title
      this.oldTitleEditing = title
      this.fixcontainertrue()
    },
    cancelEducationEdit () {
      this.editing = !this.editing
      this.titleEditing = ''
      this.fixcontainerfalse()
    },
    finishEducationEdit () {
      this.$v.$touch()
      if (!this.dublicateEdit) {
        this.$store.dispatch('editEducation', {
          id: this.educationId,
          title: this.titleEditing
        })
        this.editing = !this.editing
        this.EducationDependence(this.teachers, this.subjects, this.educationId, this.titleEditing)
        this.fixcontainerfalse()
      }
    },
    EducationDependence (teacharray, subarray, id, replacement) {
      for (let key in teacharray) {
        for (let kk in teacharray[key].education) {
          if (id === kk) {
            this.$store.dispatch('editSwitchTeacherEducation', {
              idteacher: teacharray[key].id,
              id: kk,
              title: replacement
            })
            this.$store.dispatch('loadTeachers')
          }
        }
      }
      for (let key in subarray) {
        for (let kk in subarray[key].education) {
          if (id === kk) {
            this.$store.dispatch('editSwitchSubjectEducation', {
              idsubject: subarray[key].id,
              id: kk,
              title: replacement
            })
            this.$store.dispatch('loadSubjects')
          }
        }
      }
    },
    finishEducationDelete (id) {
      this.$store.dispatch('deleteEducation', id)
      this.$store.dispatch('loadEducations')
      this.deleteEducationDependence(id, this.teachers, this.subjects)
      this.$store.dispatch('loadTeachers')
      this.$store.dispatch('loadSubjects')
      this.fixcontainerfalse()
      this.remove = false
    },
    deleteEducationDependence (id, teacharray, subarray) {
      for (let key in teacharray) {
        for (let kk in teacharray[key].education) {
          if (id === kk) {
            this.$store.dispatch('deleteSwitchTeacherEducation', {
              idteacher: teacharray[key].id,
              id: kk
            })
          }
        }
      }
      for (let key in subarray) {
        for (let kk in subarray[key].education) {
          if (id === kk) {
            this.$store.dispatch('deleteSwitchSubjectEducation', {
              idsubject: subarray[key].id,
              id: kk
            })
          }
        }
      }
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  computed: {
    educations () {
      return this.$store.getters.educations
    },
    teachers () {
      return this.$store.getters.teachers
    },
    subjects () {
      return this.$store.getters.subjects
    },
    loading () {
      return this.$store.getters.loading
    },
    dublicate () {
      for (let i = 0; i < this.educations.length; i++) {
        if (this.educations[i].title === this.educationTitle) {
          return true
        }
      }
      return false
    },
    dublicateEdit () {
      for (let i = 0; i < this.educations.length; i++) {
        if (this.educations[i].title === this.titleEditing && this.educations[i].title !== this.oldTitleEditing) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style scoped>

    @import '../assets/styles/index.css';

    .education-container {
        display: flex;
        justify-content: center;
    }

    .education-container-content {
        width: 100%;
    }

    .education-item {
        margin-bottom: 20px;
    }

    .education-item:last-child {
        margin-bottom: 0px;
    }

    .education-item__title {
        word-break: break-all;
    }

    .education-item__info {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .education-item__header {
        margin-bottom: 18px !important;
    }

    .education-item__header > span {
        margin-bottom: 0;
    }

    .ui-title-1 {
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

    .education-list__header {
        display: flex;
        margin-bottom: 20px;
        flex-direction: column;
    }

    .education-item__header {
        display: flex;
        justify-content: space-between;
    }

    .education-item__info span {
        margin-right: 20px;
    }

    .education-item__info span:last-child {
        margin-right: 0;
    }

    @media all and (max-width: 768px) {
        .ui-title-1,
        .empty {
            text-align: center;
        }
    }
</style>
