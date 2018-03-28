// @flow weak

const { getUserId } = require('./utils')
const queries = require('./queries')
const mutations = require('./mutations')
const resolvers = require('./resolvers')

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
  schema: '',
  queryText,
  mutationText,
  queries,
  mutations,
  directives: {},
  resolvers,
  getUserId,
}
