// @flow

const { makeExecutableSchema } = require('graphql-tools')

const preset = require('preset')
const translations = require('translations')
const user = require('user')

const resolvers = {
  ...preset.resolvers,
  ...translations.resolvers,
  ...user.resolvers,
  Query: {
    ...preset.queries,
    ...translations.queries,
    ...user.queries,
  },
  Mutation: {
    ...preset.mutations,
    ...translations.mutations,
    ...user.mutations,
  },
}

const directiveResolvers = {
  ...preset.directives,
  ...translations.directives,
  ...user.directives,
}

const typeDefs = `
${preset.typeDefs}
${translations.typeDefs}
${user.typeDefs}

type Query {
${preset.queryText}
${translations.queryText}
${user.queryText}
}

type Mutation {
${preset.mutationText}
${translations.mutationText}
${user.mutationText}
}

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