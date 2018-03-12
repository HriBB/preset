// @flow weak

exports.AuthPayload = {
  user: ({ user: { id } }, args, ctx, info) => {
    return ctx.db.query.user({ where: { id } }, info)
  },
}