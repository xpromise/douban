const Users = require('../model/Users')

export async function checkPassword (email, password) {
  let match = false
  const user = await Users.findOne({email})

  if (user) {
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}