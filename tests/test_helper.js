const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getToken = (id, username) => {
  const tokenUser = { username, id }
  return jwt.sign(tokenUser, process.env.SECRET)
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(Blog.format)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(User.format)
}

module.exports = {
  blogsInDb,
  usersInDb,
  getToken
}
