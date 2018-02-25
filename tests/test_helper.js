const Blog = require('../models/blog')
const User = require('../models/user')

const formatBlog = blog => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    id: blog._id
  }
}

const formatUser = user => {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    fullAge: user.fullAge
  }
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(formatBlog)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(formatUser)
}

module.exports = {
  blogsInDb,
  usersInDb
}
