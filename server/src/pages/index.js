// @flow weak

const { resolve } = require('path')
const { readSchema } = require('utils')

const queries = require('./queries')
const mutations = require('./mutations')

const typeDefs = readSchema(resolve(__dirname, 'schema.graphql'))

module.exports = {
  typeDefs,
  queries,
  mutations,
  directives: {},
  resolvers: {},
}