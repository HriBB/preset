// @flow

const { resolve } = require('path')

module.exports = {
  root: __dirname,
  server: {
    port: 4000,
    endpoint: '/',
    /*
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
    */
    uploads: {
      maxFiles: 10,
    },
  },
  db: {
    typeDefs: resolve(__dirname, '..', 'generated', 'prisma.graphql'),
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    debug: true,
  },
  uploads: {
    url: 'http://localhost:4000/uploads',
    path: resolve(__dirname, '..', '..', 'uploads'),
  },
}
