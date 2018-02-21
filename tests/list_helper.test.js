const listHelper = require('../utils/list_helper')

const emptyList = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const biggerList = [
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

test('dummy is called', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('totalLikes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(biggerList)
    expect(result).toBe(36)
  })
})

describe('favoriteBlog', () => {
  test('the most voted blog is returned from bigger list', () => {
    const result = listHelper.favoriteBlog(biggerList)
    expect(result).toEqual(biggerList[0])
  })

  test('the most voted blog is returned from list with one blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('the most voted blog is returned from an empty list', () => {
    const result = listHelper.favoriteBlog(emptyList)
    expect(result).toBe(undefined)
  })
})

describe('mostBlogs', () => {
  test('the writer who has written most blogs from bigger list', () => {
    const result = listHelper.mostBlogs(biggerList)
    expect(result.author).toBe('Robert C. Martin')
    expect(result.blogs).toBe(3)
  })

  test('the writer who has written most blogs from list with one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result.author).toBe('Edsger W. Dijkstra')
    expect(result.blogs).toBe(1)
  })

  test('the writer who has written most blogs from an empty list', () => {
    const result = listHelper.mostBlogs(emptyList)
    expect(result).toBe(undefined)
  })
})

describe('mostLikes', () => {
  test('the writer who has most likes from bigger list', () => {
    const result = listHelper.mostLikes(biggerList)
    expect(result.author).toBe('Edsger W. Dijkstra')
    expect(result.likes).toBe(17)
  })

  test('the writer who has most likes from list with one blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result.author).toBe('Edsger W. Dijkstra')
    expect(result.likes).toBe(5)
  })

  test('the writer who has most likes from an empty list', () => {
    const result = listHelper.mostLikes(emptyList)
    expect(result).toBe(undefined)
  })
})
