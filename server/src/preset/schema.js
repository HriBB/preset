// @flow weak

const { importSchema } = require('graphql-import')
const config = require('config')

const schema = importSchema(config.schema)

module.exports = schema