
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

const fs = require('fs')
const { resolve } = require('path')
//const chalk = require('chalk')
//const mkdirp = require('mkdirp')

const createFormat = require('@lingui/cli/api/formats/lingui').default
//const { extract, collect, cleanObsolete } = require('@lingui/cli/api/extract')
//const { printStats } = require('@lingui/cli/api/stats')

const linguiExtract = require('@lingui/cli/lingui-extract').default

const argv = require('minimist')(process.argv.slice(2))

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

const extractServerTranslations = () => {
  console.log('Generating server messages…')
  const serverRoot = resolve(__dirname, '..', 'server')
  require('app-module-path').addPath(resolve(serverRoot, 'src'))
  require('app-module-path').addPath(resolve(serverRoot, 'node_modules'))

  const models = require('preset/models')

  const keys = {}
  models.forEach(({ name }) => {
    keys[`cms.${name.toLowerCase()}_single`] = true
    keys[`cms.${name.toLowerCase()}_plural`] = true
  })
  models.forEach(({ fields }) => {
    fields.forEach(({ name }) => {
      keys[`cms.${name.toLowerCase()}_field`] = true
    })
  })

  const messages = Object.keys(keys).map(key => `i18nMark('${key}')`).join('\n')
  const content = `const { i18nMark } = require('@lingui/core')\n${messages}`

  const folder = resolve(__dirname, '..', 'server', '.cache')
  const file = resolve(folder, 'translations.js')

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }

  fs.writeFileSync(file, content)
}

const rootDir = resolve(__dirname, '..')

switch (argv.src) {
  case 'website':
    extractTranslations({
      rootDir,
      localeDir: resolve(rootDir, 'website', 'src', 'locale'),
      srcPathDirs: [
        resolve(rootDir, 'website', 'src'),
      ],
    })
    const inputFile = resolve(rootDir, 'website', 'src', 'locale', 'en', 'messages.json')
    const json = fs.readFileSync(inputFile)
    const messages = Object.keys(JSON.parse(json))
    const content = `export default [\n${messages.map(id => `  '${id}'`).join(`,\n`)},\n]`
    const outputFile = resolve(rootDir, 'src', 'components', 'Translations', 'messages.js')
    fs.writeFileSync(outputFile, content)
    break
  case 'cms':
    extractServerTranslations()
    extractTranslations({
      rootDir,
      localeDir: resolve(rootDir, 'src', 'locale'),
      srcPathDirs: [
        resolve(rootDir, 'src'),
        resolve(rootDir, 'server', '.cache'),
      ],
    })
    break
  default:
    console.log(`Invalid src parameter "${argv.src}"! Only "cms" and "website" are allowed.`)
    break
}

/*
const convertFormat = options.prevFormat || format
const locales = convertFormat.getLocales()

const buildDir = resolve(config.localeDir, '_build')
if (!fs.existsSync(buildDir)) {
  mkdirp(buildDir)
}

console.log('Extracting messages from source files…')
extract(config.srcPathDirs, config.localeDir, {
  ignore: config.srcPathIgnorePatterns,
  verbose: options.verbose,
})
options.verbose && console.log()

console.log('Collecting all messages…')
const clean = options.clean ? cleanObsolete : id => id
const catalog = collect(buildDir)
const catalogs = clean(convertFormat.merge(catalog))
options.verbose && console.log()

console.log('Writing message catalogues…')
locales
  .map(locale => format.write(locale, catalogs[locale]))
  .forEach(([created, filename]) => {
    if (!filename || !options.verbose) return

    if (created) {
      console.log(chalk.green(`Created ${filename}`))
    } else {
      console.log(chalk.green(`Updated ${filename}`))
    }
  })
options.verbose && console.log()

console.log('Messages extracted!\n')

console.log('Catalog statistics:')
printStats(config, catalogs)

*/