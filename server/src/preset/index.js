// @flow weak

const { resolve } = require('path')
const { readSchema } = require('utils')

const models = require('./models')
const queries = require('./queries')
const mutations = require('./mutations')
const resolvers = require('./resolvers')
const directives = require('./directives')

const typeDefs = readSchema(resolve(__dirname, 'preset.graphql'))

const queryText = `
  files: [File]
  file(id: ID!): File
  ${models.map(model => `
  ${model.listQuery}: [${model.name}]
  ${model.itemQuery}(id: ID!): ${model.name}
`).join('')}`

const f = ({ name, type, required }) => 
  `${name}: ${type === 'File' ? 'Upload' : type}${required ? '!' : ''}`

const mutationText = models.map(({ name, fields }, i) => `
  create${name}(${fields.map(f).join(' ')}): ${name}
  update${name}(id: ID! ${fields.map(f).join(' ')}): ${name}
  delete${name}(id: ID!): ${name}
`).join('')

module.exports = {
  typeDefs,
  queryText,
  mutationText,
  queries,
  mutations,
  directives,
  resolvers,
}
