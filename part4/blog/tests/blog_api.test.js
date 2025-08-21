const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  response.body.forEach(blog => {
    assert.ok(blog.id, 'Blog post missing id property')
    assert.strictEqual(blog._id, undefined)
  })
})

test('making an HTTP POST request successfully creates a new blog post', async () => {
  const newBlog = {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert(titles.includes('Go To Statement Considered Harmful'))
})

test('if the likes property is missing , defult it to zero', async () => {
  const newBlog = {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(response.body.likes, 0)
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})

test('if the title or url properties are missing, responds with 400', async () => {
  const newBlog1 = {
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  }
  const newBlog2 = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12
  }

  await api
    .post('/api/blogs')
    .send(newBlog1)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlog2)
    .expect(400)
})

test('delete a single blog post and return 204', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const content = blogsAtEnd.map(blog => blog.id)

  assert(!content.includes(blogToDelete.id))
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('update the likes of a single blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const newLikes = blogToUpdate.likes + 1

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send( {likes: newLikes} )
    .expect(200)

  assert.strictEqual(response.body.likes, newLikes)

  const blogsAtEnd = await helper.blogsInDb()
  const updeatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
  assert.strictEqual(updeatedBlog.likes, newLikes)

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})