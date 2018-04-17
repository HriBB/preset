// @flow weak

exports.pages = async (parent, args, ctx, info) => {
  return ctx.db.query.pages({}, info)
}

exports.page = async (parent, { id }, ctx, info) => {
  return ctx.db.query.page({ where: { id } }, info)
}
