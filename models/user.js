const mongoose = require('mongoose')

const User = mongoose.model('User', {
  username: String,
  passwordHash: String,
  name: String,
  fullAge: Boolean
})

module.exports = User
