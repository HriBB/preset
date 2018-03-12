// @flow weak

const path = require('path')
const { buildASTSchema, parse } = require('graphql')
const { importSchema } = require('graphql-import')

const getModels = require('./getModels')
const { createQueryText, createQueries } = require('./queries')
const { createMutationText, createMutations } = require('./mutations')
const resolvers = require('./resolvers')
const directives = require('./directives')

const schema = importSchema(path.resolve(__dirname, '..', 'schema.graphql'))
const ast = buildASTSchema(parse(schema))
const models = getModels(ast)

const queryText = createQueryText(models)
const queries = createQueries(models)

const mutationText = createMutationText(models)
const mutations = createMutations(models)

module.exports = {
  schema,
  queryText,
  mutationText,
  queries,
  mutations,
  directives,
  resolvers,
}
