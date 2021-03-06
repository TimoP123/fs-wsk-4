const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({}).populate('blogs')
    response.status(200).json(users.map(User.format))
  } catch (exception) {
    response.status(500).json({ error: 'something went wrong...' })
  }
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const existingUser = await User.find({ username: body.username })
    if (existingUser.length > 0) {
      return response.status(400).json({ error: 'username must be unique' })
    }

    if (body.password.length < 3) {
      return response
        .status(400)
        .json({ error: 'password must be at least 3 characters' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    let isFullAged = true
    if (body.fullAge === false) {
      isFullAged = body.fullAge
    }

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      fullAge: isFullAged
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter
