const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog =  (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((fav, item) => fav.likes > item.likes ? fav : item )
}

const mostBlogs_t = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = {}

  blogs.forEach(blog => {
    const author = blog.author
    authorCounts[author] = (authorCounts[author] || 0) + 1
  })

  let maxAuthor = null
  let maxBlogs = 0

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxBlogs = authorCounts[author]
      maxAuthor= author
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}

const mostLikes_t = (blogs) => {
  if (blogs.length === 0) return null

  const likeCounts = {}

  blogs.forEach(blog => {
    const author = blog.author
    likeCounts[author] = (likeCounts[author] || 0) + blog.likes
  })

  let maxAuthor = null
  let maxLikes = 0

  for (const author in likeCounts) {
    if (likeCounts[author] > maxLikes) {
      maxLikes = likeCounts[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = _.countBy(blogs, 'author')
  const author = _.maxBy(Object.keys(counts), o => counts[o])
  return {
    author,
    blogs: counts[author]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')
  const authorLikes = _.map(grouped, (authorBlogs, author) => {
    return {
      author,
      likes: _.sumBy(authorBlogs, 'likes')
    }
  })

  return _.maxBy(authorLikes, 'likes')
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}