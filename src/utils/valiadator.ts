class FormValidator {
  isEmail(email: string) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  }
  isValidUsername(username: string) {
    return /^[A-Za-z0-9]+\d*$/.test(username) || this.isEmail(username)
  }
  isValidenames(name: string) {
    return /^[A-Za-z]+$/.test(name)
  }
  isStrongPassword(password: string) {
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(password)
  }
}
export const formValidator = new FormValidator()
