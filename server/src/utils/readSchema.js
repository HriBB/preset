// @flow weak

const { resolve } = require('path')
const { readFileSync } = require('fs')
const config = require('config')

const readSchema = (path) => {
  return readFileSync(resolve(config.root, path), 'utf8')
}

module.exports = readSchema
