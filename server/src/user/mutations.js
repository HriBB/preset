// @flow weak

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { uploadFile } = require('utils')
const { getUserId } = require('./utils')

exports.signup = async (parent, args, ctx, info) => {
  const password = await bcrypt.hash(args.password, 10)
  const user = await ctx.db.mutation.createUser({
    data: { ...args, password },
  }, info)
  return {
    token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
    user,
  }
}

exports.login = async (parent, { username, password }, ctx, info) => {
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
}

exports.createUser = async (parent, args, ctx, info) => {
  throw new Error('createUser not implemented')
}

exports.updateUser = async (parent, args, ctx, info) => {
  throw new Error('updateUser not implemented')
}

exports.deleteUser = async (parent, args, ctx, info) => {
  throw new Error('deleteUser not implemented')
}

exports.setProfilePicture = async (parent, { image }, ctx, info) => {
  const userId = getUserId(ctx)
  const { filename, mimetype } = await uploadFile(image)
  const file = await ctx.db.mutation.createFile(
    {
      data: { filename, mimetype },
    },
  )
  await ctx.db.mutation.updateUser(
    {
      data: { image: { connect: { id: file.id } } },
      where: { id: userId },
    },
    info
  )
  return file
}
