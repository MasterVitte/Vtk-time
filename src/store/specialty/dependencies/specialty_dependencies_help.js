export default class Dependence {
  constructor (specialty, department_id, user = null, id = null) {
    this.specialty = specialty
    this.department_id = department_id
    this.user = user
    this.id = id
  }
}
