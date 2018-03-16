// @flow weak

const schema = require('./schema')

const queryText = require('./queryText')
const mutationText = require('./mutationText')

const queries = require('./queries')
const mutations = require('./mutations')

const resolvers = require('./resolvers')
const directives = require('./directives')

module.exports = {
  schema,
  queryText,
  mutationText,
  queries,
  mutations,
  directives,
  resolvers,
}
