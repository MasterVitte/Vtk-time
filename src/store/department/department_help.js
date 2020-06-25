export default class Department {
  constructor (title, use = false, user = null, id = null) {
    this.title = title
    this.use = use
    this.user = user
    this.id = id
  }
}
