// @flow weak

const { readFileSync } = require('fs')
const config = require('config')

const readSchema = (file) => {
  return readFileSync(file, 'utf8')
}

module.exports = readSchema
