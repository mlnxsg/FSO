const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.c7c7vxj.mongodb.net/testBlogApp?retryWrites=true&w=majority&appName=Cluster0`