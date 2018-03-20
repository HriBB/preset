// @flow weak

const keyBy = require('lodash.keyby')

const models = require('./models')

let modelsByName = null

const queries = Object.assign(
  {
    files: (parent, args, ctx, info) => {
      return ctx.db.query.files({}, info)
    },
    file: (parent, { id }, ctx, info) => {
      return ctx.db.query.file({ where: { id } }, info)
    },
    models: (parent, { name }, ctx, info) => {
      return models
    },
    model: (parent, { name }, ctx, info) => {
      if (!modelsByName) {
        modelsByName = keyBy(models, 'name')
      }
      if (!modelsByName[name]) {
        throw new Error(`Model ${name} not found!`)
      }
      return modelsByName[name]
    },
    translations: (parent, args, ctx, info) => {
      throw new Error(`not implementeeeeeee`)
    },
  },
  models.reduce((queries, { itemQueryName, listQueryName }) => ({
    ...queries,
    [itemQueryName]: (parent, { id }, ctx, info) => (
      ctx.db.query[itemQueryName]({ where: { id } }, info)
    ),
    [listQueryName]: (parent, args, ctx, info) => (
      ctx.db.query[listQueryName]({}, info)
    ),
  }), {})
)

module.exports = queries
