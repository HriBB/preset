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
  models.reduce((queries, model) => ({
    ...queries,
    [model.itemQuery]: (parent, { id }, ctx, info) => {
      return ctx.db.query[model.itemQuery]({ where: { id } }, info)
    },
    [model.listQuery]: (parent, args, ctx, info) => {
      return ctx.db.query[model.listQuery]({}, info)
    },
  }), {})
)

module.exports = queries
