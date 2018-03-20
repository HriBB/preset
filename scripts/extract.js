
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
require('../config/env')

const { resolve } = require('path')
const { existsSync, mkdirSync, writeFileSync } = require('fs')

const serverRoot = resolve(__dirname, '..', 'server')
require('app-module-path').addPath(resolve(serverRoot, 'src'))
require('app-module-path').addPath(resolve(serverRoot, 'node_modules'))

const models = require('preset/models')

const keys = {}
models.forEach(({ id }) => {
  keys[`cms.${id}_single`] = true
  keys[`cms.${id}_plural`] = true
})
models.forEach(({ fields }) => {
  fields.forEach(({ name }) => {
    keys[`cms.${name.toLowerCase()}_field`] = true
  })
})

const content = `const { i18nMark } = require('@lingui/core')
${Object.keys(keys).map(key =>
  `i18nMark('${key}')`
).join('\n')}
`

const folder = resolve(__dirname, '..', 'server', '.cache')
const file = resolve(folder, 'translations.js')

if (!existsSync(folder)) {
  mkdirSync(folder)
}

writeFileSync(file, content)
