// @flow

const { makeExecutableSchema } = require('graphql-tools')

const user = require('user')
const preset = require('preset')
const translations = require('translations')

const resolvers = {
  ...user.resolvers,
  ...preset.resolvers,
  ...translations.resolvers,
  Query: {
    ...user.queries,
    ...preset.queries,
    ...translations.queries,
  },
  Mutation: {
    ...user.mutations,
    ...preset.mutations,
    ...translations.mutations,
  },
}

const directiveResolvers = {
  ...user.directives,
  ...preset.directives,
  ...translations.directives,
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