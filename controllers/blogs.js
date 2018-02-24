const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlog = blog => {
  return {
    id: blog._id,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
}

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs.map(formatBlog))
  } catch (exception) {
    response.status(500).json({ error: 'something went wrong...' })
  }
})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      response.json(formatBlog(blog))
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)

    if (
      blog.title === undefined ||
      blog.url === undefined ||
      blog.author === undefined
    ) {
      return response
        .status(400)
        .json({ error: 'Title, author or url missing' })
    }

    if (blog.likes === undefined) {
      blog.likes = 0
    }

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (exception) {
    response.status(500).json({ error: 'something went wrong...' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body
    )
    if (updatedBlog) {
      response.status(200).end()
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    response.status(500).json(exception)
  }
})

module.exports = blogsRouter
