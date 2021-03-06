// @flow

const { resolve } = require('path')

module.exports = {
  root: __dirname,
  schema: resolve(__dirname, 'preset', 'preset.graphql'),
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
