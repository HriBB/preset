// @flow weak

const { resolve } = require('path')
const { readSchema } = require('utils')
const { importSchema } = require('graphql-import')

const { getModels } = require('./utils')

const schema = importSchema(resolve(__dirname, 'preset.graphql'))

const models = getModels(schema)

module.exports = models 
