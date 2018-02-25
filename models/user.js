const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  name: String,
  fullAge: Boolean,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.format = user => {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    fullAge: user.fullAge,
    blogs: user.blogs
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
