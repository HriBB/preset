// @flow

const { makeExecutableSchema } = require('graphql-tools')

const user = require('user')
const pages = require('pages')
const preset = require('preset')
const translations = require('translations')

const resolvers = {
  ...user.resolvers,
  ...pages.resolvers,
  ...preset.resolvers,
  ...translations.resolvers,
  Query: {
    ...user.queries,
    ...pages.queries,
    ...preset.queries,
    ...translations.queries,
  },
  Mutation: {
    ...user.mutations,
    ...pages.mutations,
    ...preset.mutations,
    ...translations.mutations,
  },
}

const directiveResolvers = {
  ...user.directives,
  ...pages.directives,
  ...preset.directives,
  ...translations.directives,
}

const typeDefs = `
${user.typeDefs}
${pages.typeDefs}
${preset.typeDefs}
${translations.typeDefs}

type Query {
  _: Boolean
}
type Mutation{
  _: Boolean
}

schema {
  query: Query
  mutation: Mutation
}
`

//console.log(typeDefs)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers,
})

module.exports = schema