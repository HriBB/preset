// @flow

const { makeExecutableSchema } = require('graphql-tools')

const preset = require('preset')
const user = require('user')

const resolvers = {
  ...preset.resolvers,
  ...user.resolvers,
  Query: {
    ...preset.queries,
    ...user.queries,
  },
  Mutation: {
    ...preset.mutations,
    ...user.mutations,
  },
}

const directiveResolvers = {
  ...preset.directives,
  ...user.directives,
}

const typeDefs = `
${preset.schema}${user.schema}

type Query {${preset.queryText}${user.queryText}}

type Mutation {${preset.mutationText}${user.mutationText}}

schema {
  query: Query
  mutation: Mutation
}
`

console.log(typeDefs)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers,
})

module.exports = schema