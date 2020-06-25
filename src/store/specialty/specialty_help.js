export default class Specialty {
  constructor (title, use = false, user = null, id = null) {
    this.title = title
	  this.use = use
    this.user = user
    this.id = id
  }
}
