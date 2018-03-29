// @flow weak

const { resolve } = require('path')
const { readSchema } = require('utils')

const queries = require('./queries')
const mutations = require('./mutations')

const typeDefs = readSchema(resolve(__dirname, 'translations.graphql'))

const queryText = `
  translations(lang: String! ns: [String]): JSON
`

const mutationText = `
  updateTranslations(lang: String! messages: JSON!): JSON
  setTranslationEditor(lang: String! ns: String! key: String! editor: String!): Translation
`

module.exports = {
  typeDefs,
  queryText,
  mutationText,
  queries,
  mutations,
  directives: {},
  resolvers: {},
}
