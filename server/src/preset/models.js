// @flow weak

const { resolve } = require('path')
const { readSchema } = require('utils')
const { importSchema } = require('graphql-import')

const schema = importSchema(resolve(__dirname, 'preset.graphql'))

const { getModels } = require('preset-server')

const models = getModels(schema)

module.exports = models 
