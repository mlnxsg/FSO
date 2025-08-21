const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when creating a new user with invalid data', async () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const initialUser = new User({
      username: "test",
      name: "apitest",
      passwordHash
    })

    await initialUser.save()
  })

  test('missing username returns 400 and proper error message', async () => {
    const newUser = {
      name: "kun",
      password: "3qazwsx"
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const errorMessage = response.body.error || ''
    assert(errorMessage.toLowerCase().includes('username'))
    assert(errorMessage.toLowerCase().includes('required'))
  })

  test('username less than 3 characters long returns 400 and proper error message', async () => {
  const newUser = {
    username: "wb",
    name: "haha",
    password: "123456"
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const errorMessage = response.body.error
  assert(errorMessage.toLowerCase().includes('username'))
  assert(errorMessage.toLowerCase().includes('minimum allowed length'))
  })

  test('same username returns 400 and proper error message', async () => {
    const newUser = {
      username: "test",
      name: "haha",
      password: "123456"
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const errorMessage = response.body.error
    assert(errorMessage.toLowerCase().includes('username'))
    assert(errorMessage.toLowerCase().includes('unique'))
  })

  test('missing password returns 400 and proper error message', async () => {
    const newUser = {
      username: "test",
      name: "ttt"
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const errorMessage = response.body.error
    assert(errorMessage.toLowerCase().includes('password'))
    assert(errorMessage.toLowerCase().includes('required'))
  })

  test('password less than 3 characters long return 400 and proper error message', async () => {
    const newUser = {
      username: "hlw",
      name: "hanli",
      password: "12"
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const errorMessage = response.body.error
    assert(errorMessage.toLowerCase().includes('password'))
    assert(errorMessage.includes('3'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
