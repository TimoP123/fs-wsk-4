const dummy = blogs => {
  console.log(blogs)
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
  return blogs.sort((a, b) => b.likes - a.likes)[0]
}

const mostBlogs = blogs => {
  let blogWriters = []

  blogs.forEach(blog => {
    let writer = blog.author
    let blogWriter = blogWriters.find(x => x.author === writer)
    if (blogWriter) {
      blogWriter.blogs++
    } else {
      blogWriters.push({ author: blog.author, blogs: 1 })
    }
  })

  blogWriters.sort((a, b) => b.blogs - a.blogs)
  return blogWriters[0]
}

const mostLikes = blogs => {
  let blogWriters = []

  blogs.forEach(blog => {
    let writer = blog.author
    let blogWriter = blogWriters.find(x => x.author === writer)
    if (blogWriter) {
      blogWriter.likes += blog.likes
    } else {
      blogWriters.push({ author: blog.author, likes: blog.likes })
    }
  })

  blogWriters.sort((a, b) => b.likes - a.likes)
  return blogWriters[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
