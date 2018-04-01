// @flow weak

const { resolve } = require('path')
const { readSchema } = require('utils')

const queries = require('./queries')
const mutations = require('./mutations')

const typeDefs = readSchema(resolve(__dirname, 'translations.graphql'))

module.exports = {
  typeDefs,
  queryText: '',
  mutationText: '',
  queries,
  mutations,
  directives: {},
  resolvers: {},
}
