const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('making an HTTP POST request successfully creates a new blog post', async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('123456', 10)
  const testUser = new User({ username: 'test', passwordHash })
  await testUser.save()

  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 5,
  }

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'test', password: '123456' })

  const token = loginResponse.body.token

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert(titles.includes('Canonical string reduction'))
})

test('adding a blog fails with 401 unauthorized if a token is not provided', async () => {
  const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    likes: 15,
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  assert.ok(response.body.error.toLowerCase().includes('token'))
})

after(async () => {
  await mongoose.connection.close()
})