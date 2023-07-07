export default {
  isValidenames: (name: string): boolean => {
    return /^[A-Za-z]+$/.test(name)
  },
  isEmail: (email: string): boolean => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  },
  isValidUsername: (username: string): boolean => {
    return /^[A-Za-z]+$/.test(username)
  },
  isStrongPassword: (password: string): boolean => {
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(password)
  }
}
