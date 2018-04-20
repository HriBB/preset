// @flow

const { makeExecutableSchema } = require('graphql-tools')

const user = require('user')
const pages = require('pages')
const deploy = require('deploy')
const preset = require('preset')
const translations = require('translations')

const resolvers = {
  ...user.resolvers,
  ...pages.resolvers,
  ...preset.resolvers,
  ...translations.resolvers,
  ...deploy.resolvers,
  Query: {
    ...user.queries,
    ...pages.queries,
    ...preset.queries,
    ...translations.queries,
    ...deploy.queries,
  },
  Mutation: {
    ...user.mutations,
    ...pages.mutations,
    ...preset.mutations,
    ...translations.mutations,
    ...deploy.mutations,
  },
  Subscription: {
    ...deploy.subscriptions,
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
${deploy.typeDefs}

type Query {
  _: Boolean
}
type Mutation {
  _: Boolean
}
type Subscription {
  _: Boolean
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`

//console.log(typeDefs)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers,
})

module.exports = schema