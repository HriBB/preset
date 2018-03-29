// @flow weak

const models = require('./models')

const queries = Object.assign(
  {
    file: (parent, { id }, ctx, info) => {
      return ctx.db.query.file({ where: { id } }, info)
    },
    files: (parent, args, ctx, info) => {
      return ctx.db.query.files({}, info)
    },
  },
  models.reduce((queries, { itemQuery, listQuery }) => ({
    ...queries,
    [itemQuery]: (parent, { id }, ctx, info) => (
      ctx.db.query[itemQuery]({ where: { id } }, info)
    ),
    [listQuery]: (parent, args, ctx, info) => (
      ctx.db.query[listQuery]({}, info)
    ),
  }), {})
)

module.exports = queries
