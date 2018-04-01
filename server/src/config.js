// @flow

const { resolve } = require('path')

module.exports = {
  root: __dirname,
  server: {
    port: 4000,
    endpoint: '/',
    uploads: {
      maxFiles: 10,
    },
  },
  db: {
    typeDefs: './src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    debug: true,
  },
  uploads: {
    url: 'http://localhost:4000/uploads',
    path: resolve(__dirname, '..', 'uploads'),
  },
}
