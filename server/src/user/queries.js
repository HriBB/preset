// @flow weak

const { getUserId } = require('./utils')

exports.viewer = async (parent, args, ctx, info) => {
  try {
    const id = getUserId(ctx)
    const user = await ctx.db.query.user({ where: { id } }, info)
    console.log('got user', user)
    return user
  } catch (e) {
    return null
  }
}

exports.users = (parent, args, ctx, info) => {
  return ctx.db.query.users({}, info)
}