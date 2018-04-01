
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'lingui'
process.env.NODE_ENV = 'production'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
require('../config/env')

// Load dependencies
const fs = require('fs')
const { resolve } = require('path')

// Process arguments
const argv = require('minimist')(process.argv.slice(2))

// Load linui cli functions
const createFormat = require('@lingui/cli/api/formats/lingui').default
const linguiExtract = require('@lingui/cli/lingui-extract').default

// Setup paths
const root = resolve(__dirname, '..', '..')
//const preset = resolve(root, 'preset')
const admin = resolve(root, 'admin')
const server = resolve(root, 'server')
const website = resolve(root, 'website')

const extractTranslations = (cfg) => {
  const config = Object.assign({
    format: 'lingui',
    fallbackLocale: 'en',
    sourceLocale: '',
    srcPathIgnorePatterns: [
      '/node_modules/',
    ],
  }, cfg)

  const format = createFormat(config)

  const options = {
    verbose: false,
    clean: true,
  }

  linguiExtract(config, format, options)
}

const extractAdminTranslations = () => {
  console.log('Generating server messages…')
  require('app-module-path').addPath(resolve(server, 'src'))
  require('app-module-path').addPath(resolve(server, 'node_modules'))

  const models = require('preset/models')

  const keys = {}
  models.forEach(({ name }) => {
    keys[`${name}_single`] = true
    keys[`${name}_plural`] = true
  })
  models.forEach(({ fields }) => {
    fields.forEach(({ name }) => {
      keys[name] = true
    })
  })

  const messages = Object.keys(keys).map(key => `i18nMark('${key}')`).join('\n')
  const content = `const { i18nMark } = require('@lingui/core')\n${messages}`

  const cache = resolve(server, '.cache')
  const file = resolve(cache, 'translations.js')

  if (!fs.existsSync(cache)) {
    fs.mkdirSync(cache)
  }

  fs.writeFileSync(file, content)

  console.log('****************')
  console.log('****************')
  console.log(resolve(admin, 'src', 'locale'))
  console.log([
    resolve(admin, 'src'),
    resolve(server, '.cache'),
  ])
  console.log('****************')
  console.log('****************')

  extractTranslations({
    localeDir: resolve(admin, 'src', 'locale'),
    srcPathDirs: [
      resolve(admin, 'src'),
      resolve(server, '.cache'),
    ],
  })
}

const extractWebsiteTranslations = () => {
  extractTranslations({
    localeDir: resolve(website, 'src', 'locale'),
    srcPathDirs: [
      resolve(website, 'src'),
    ],
  })
  const inputFile = resolve(website, 'src', 'locale', 'en', 'messages.json')
  const json = fs.readFileSync(inputFile)
  const messages = Object.keys(JSON.parse(json))
  const content = `export default [\n${messages.map(id => `  '${id}'`).join(`,\n`)},\n]`
  const outputFile = resolve(admin, 'src', 'components', 'Translations', 'messages.js')
  fs.writeFileSync(outputFile, content)
}

switch (argv.src) {
  case 'admin':
    extractAdminTranslations()
    break
  case 'website':
    extractWebsiteTranslations()
    break
  default:
    console.log(`Invalid src parameter "${argv.src}"! Only "admin" and "website" are allowed.`)
    break
}
