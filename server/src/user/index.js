// @flow weak

const { resolve } = require('path')
const { readSchema } = require('utils')
const { getUserId } = require('./utils')
const queries = require('./queries')
const mutations = require('./mutations')
const resolvers = require('./resolvers')

const typeDefs = readSchema(resolve(__dirname, 'user.graphql'))

const queryText = `
  viewer: User
  users: [User]
`

const mutationText = `
  signup(username: String! email: String! password: String!): AuthPayload!
  login(username: String! password: String!): AuthPayload!
  setProfilePicture(image: Upload!): File!
`

module.exports = {
  typeDefs,
  queryText,
  mutationText,
  queries,
  mutations,
  directives: {},
  resolvers,
  getUserId,
}
