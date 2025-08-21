const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  console.log('body received:', request.body)
  const body = request.body
  if (!body.title || !body.url) {
    return response.status(400).end()
  }

  const user = request.user
  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    user: user._id,
    likes: body.likes,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs || []
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'No blog found'})
  }

  const user = request.user
  const userid = user._id.toString()

  if (blog.user.toString() === userid) {
    await Blog.findByIdAndDelete(request.params.id)

    user.blogs = user.blogs.filter(id => id.toString() !== request.params.id)
    await user.save()

    return response.status(204).end()
  } else {
    return response.status(401).json({ error: 'No right to delete' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes
  const updatedBlog = await blog.save()

  return response.json(updatedBlog)
})

module.exports = blogsRouter