// @flow

const { resolve } = require('path')

module.exports = {
  schema: resolve(__dirname, 'schema.json'),
  server: {
    port: 4000,
    endpoint: '/',
    uploads: {
      maxFiles: 10,
    },
  },
  uploads: {
    url: 'http://localhost:4000/uploads',
    path: resolve(__dirname, '..', 'uploads'),
  },
}
