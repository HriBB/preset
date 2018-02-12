// @flow weak

const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { importSchema } = require('graphql-import')

const { createWriteStream } = require('fs')
const mkdirp = require('mkdirp')
const shortid = require('shortid')
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')





const { GraphQLUpload } = require('apollo-upload-server')

const uploadDir = './uploads'
const db = new lowdb(new FileSync('db.json'))

// Seed an empty DB
db.defaults({ uploads: [] }).write()

// Ensure upload directory exists
mkdirp.sync(uploadDir)

const schema = importSchema(path.resolve(__dirname, 'user.graphql'))

const queryText = `
  viewer: User
  uploads: [File]
`

const mutationText = `
  signup(username: String!, email: String!, password: String!): AuthPayload!
  login(username: String!, password: String!): AuthPayload!
  setProfilePicture(file: Upload!): File!
  singleUpload (file: Upload!): File!
  multipleUpload (files: [Upload!]!): [File!]!
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
  uploads: () => db.get('uploads').value(),
}





const storeUpload = async ({ stream, filename }) => {
  const id = shortid.generate()
  const path = `${uploadDir}/${id}-${filename}`

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id, path }))
      .on('error', reject),
  )
}

const recordFile = file =>
  db
    .get('uploads')
    .push(file)
    .last()
    .write()

const processUpload = async upload => {
  const { stream, filename, mimetype, encoding } = await upload
  const { id, path } = await storeUpload({ stream, filename })
  return recordFile({ id, filename, mimetype, encoding, path })
}


const mutations = {
  async signup(parent, args, ctx, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: { ...args, password },
    })
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
  async setProfilePicture(parent, { file }, ctx, info) {
    console.log('file', file)
    throw new Error('not implemented')
  },
  singleUpload: (obj, { file }) => processUpload(file),
  multipleUpload: (obj, { files }) => Promise.all(files.map(processUpload)),
}

const directives = {}

const resolvers = {
  AuthPayload: {
    user: async ({ user: { id } }, args, ctx, info) => {
      return ctx.db.query.user({ where: { id } }, info)
    },
  },
  Upload: GraphQLUpload,
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
