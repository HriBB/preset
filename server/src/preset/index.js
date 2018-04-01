// @flow weak

const { resolve } = require('path')
const { readSchema } = require('utils')

const models = require('./models')
const queries = require('./queries')
const mutations = require('./mutations')
const resolvers = require('./resolvers')
const directives = require('./directives')

const baseTypeDefs = readSchema(resolve(__dirname, 'preset.graphql'))

const field = ({ name, type, required }) => (
  `${name}: ${type === 'File' ? 'Upload' : type}${required ? '!' : ''}`
)

const typeDefs = `

${baseTypeDefs}

extend type Query {
  ${models.map(model => `
  ${model.listQuery}: [${model.name}]
  ${model.itemQuery}(id: ID!): ${model.name}
  `).join('')}
}

extend type Mutation {
  ${models.map(({ name, fields, ...model }, i) => `
  ${model.createMutation}(${fields.map(field).join(' ')}): ${name}
  ${model.updateMutation}(id: ID! ${fields.map(field).join(' ')}): ${name}
  ${model.deleteMutation}(id: ID!): ${name}
  `).join('')}
}

`

module.exports = {
  typeDefs,
  queries,
  mutations,
  directives,
  resolvers,
}
