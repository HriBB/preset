// @flow

const { resolve } = require('path')
const { importSchema } = require('graphql-import')

const { getModels } = require('./utils')

const schema = importSchema(resolve(__dirname, 'schema.graphql'))

const models = getModels(schema)

module.exports = models 
