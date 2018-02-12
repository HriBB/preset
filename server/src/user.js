// @flow weak

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { storeUpload } = require('utils')

const schema = ``

const queryText = `
  viewer: User
  users: [User]
`

const queries = {
  viewer(parent, args, ctx, info) {
    try {
      const id = getUserId(ctx)
      return ctx.db.query.user({ where: { id } }, info)
    } catch (e) {
      return null
    }
  },
  users(parent, args, ctx, info) {
    return ctx.db.query.users({}, info)
  },
}

const mutationText = `
  signup(username: String!, email: String!, password: String!): AuthPayload!
  login(username: String!, password: String!): AuthPayload!
  setProfilePicture(image: Upload!): File!
`

const mutations = {
  async signup(parent, args, ctx, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: { ...args, password },
    }, info)
    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  },
  async login(parent, { username, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { username } })
    if (!user) {
      throw new Error(`No such user found for username: ${username}`)
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }
    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  },
  async setProfilePicture(parent, { image }, ctx, info) {
    const userId = getUserId(ctx)
    const { filename, mimetype } = await storeUpload(image)
    const file = await ctx.db.mutation.createFile(
      {
        data: { filename, mimetype },
      },
      info
    )
    await ctx.db.mutation.updateUser(
      {
        data: { image: { connect: { id: file.id } } },
        where: { id: userId },
      },
    )
    return file
  },
}

const directives = {
  //
}

const resolvers = {
  AuthPayload: {
    user: async ({ user: { id } }, args, ctx, info) => {
      return ctx.db.query.user({ where: { id } }, info)
    },
  },
}

const getUserId = (ctx) => {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    return userId
  }

  throw new AuthError()
}

class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}

module.exports = {
  schema,
  queryText,
  mutationText,
  queries,
  mutations,
  directives,
  resolvers,
  getUserId,
  AuthError,
}
