const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { blogsInDb, usersInDb } = require('./test_helper')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const newBlog = {
  title: 'A Complete Guide to Flexbox',
  author: 'Chris Coyier',
  url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox'
}

const newBlogWithoutTitle = {
  author: 'Chris Coyier',
  url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox'
}

const newBlogWithoutUrl = {
  title: 'A Complete Guide to Flexbox',
  author: 'Chris Coyier'
}

const initialUsers = [
  {
    username: 'iivo',
    name: 'Iivo Niskanen',
    password: 'asdfghjk',
    fullAge: true
  },
  {
    username: 'kake',
    name: 'Kake Randelin',
    password: 'sdfghj',
    fullAge: true
  },
  {
    username: 'ankanpojat',
    name: 'Tupu, Hupu ja Lupu',
    password: 'sdfgh',
    fullAge: false
  }
]

const newUser = {
  username: 'pokeman',
  name: 'Viljo Nuorimies',
  password: 'sdfkjh'
}

const newUserWithTooShortPassword = {
  username: 'pokeman',
  name: 'Viljo Nuorimies',
  password: 'sh'
}

beforeAll(async () => {
  await Blog.remove({})
  await Blog.insertMany(initialBlogs)
})

describe('when there\' initially some blogs in db', () => {
  beforeAll(async () => {
    await Blog.remove({})
    const blogObjects = initialBlogs.map(n => new Blog(n))
    await Promise.all(blogObjects.map(n => n.save()))
  })

  test('all blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const returnedTitles = response.body.map(n => n.title)
    blogsInDatabase.forEach(blog => {
      expect(returnedTitles).toContain(blog.title)
    })
  })

  test('individual blogs are returned as json by GET /api/blogs/:id', async () => {
    const blogsInDatabase = await blogsInDb()
    const aBlog = blogsInDatabase[0]

    const response = await api
      .get(`/api/blogs/${aBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.title).toBe(aBlog.title)
  })
})

describe('addition of a new blog', async () => {
  beforeEach(async () => {
    await Blog.remove({})
    const blogObjects = initialBlogs.map(n => new Blog(n))
    await Promise.all(blogObjects.map(n => n.save()))
  })

  test('POST /api/blog succeeds with valid data', async () => {
    const blogsAtStart = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

    const titles = blogsAfterOperation.map(r => r.title)
    expect(titles).toContain(newBlog.title)
  })

  test('if a blog with no likes defined is added, it must have zero likes', async () => {
    const response = await api.post('/api/blogs').send(newBlog)

    const newBlogFromDB = response.body
    expect(newBlogFromDB.likes).toBe(0)
  })

  test('if blog with no title is added the api returns status code 400', async () => {
    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400)
  })

  test('if blog with no url is added the api returns status code 400', async () => {
    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400)
  })
})

describe('deletion of a blog', async () => {
  let addedBlog

  beforeAll(async () => {
    addedBlog = new Blog(newBlog)
    await addedBlog.save()
  })

  test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
    const blogsAtStart = await blogsInDb()

    await api.delete(`/api/blogs/${addedBlog.id}`).expect(204)

    const blogsAfterOperation = await blogsInDb()

    const titles = blogsAfterOperation.map(r => r.title)

    expect(titles).not.toContain(addedBlog.title)
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
  })
})

describe('PUT request on /api/blogs/:id', () => {
  beforeAll(async () => {
    await Blog.remove({})
    const blogObjects = initialBlogs.map(n => new Blog(n))
    await Promise.all(blogObjects.map(n => n.save()))
  })

  test('a blog in database can be updated', async () => {
    const blogsInDatabase = await blogsInDb()
    const aBlog = blogsInDatabase[0]

    aBlog.likes++

    await api
      .put(`/api/blogs/${aBlog.id}`)
      .send(aBlog)
      .expect(200)

    const bBlog = await api.get(`/api/blogs/${aBlog.id}`).expect(200)
    expect(aBlog.title).toEqual(bBlog.body.title)
    expect(aBlog.likes).toEqual(bBlog.body.likes)
  })
})

describe('addition of a new user', async () => {
  beforeEach(async () => {
    await User.remove({})
    const userObjects = initialUsers.map(n => new User(n))
    await Promise.all(userObjects.map(n => n.save()))
  })

  test('POST /api/users succeeds with valid data', async () => {
    const usersAtStart = await usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()

    expect(usersAfterOperation.length).toBe(usersAtStart.length + 1)

    const usernames = usersAfterOperation.map(r => r.username)
    expect(usernames).toContain(newUser.username)
  })

  test('if a user with no fullAge defined is added, it must be set true as default', async () => {
    const response = await api.post('/api/users').send(newUser)

    const newUserFromDB = response.body
    expect(newUserFromDB.fullAge).toBe(true)
  })

  test('if a user with an already taken username is posted, operation fails with statuscode 400', async () => {
    const response = await api.post('/api/users').send(newUser)

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body).toEqual({ error: 'username must be unique' })
  })

  test('if a user with too short password is added the operation fails with status code 400', async () => {
    const result = await api
      .post('/api/users')
      .send(newUserWithTooShortPassword)
      .expect(400)

    expect(result.body).toEqual({
      error: 'password must be at least 3 characters'
    })
  })
})

afterAll(() => {
  server.close()
})
