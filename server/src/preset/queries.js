// @flow weak

const keyBy = require('lodash.keyby')

exports.createQueryText = (models) => `
  files: [File]
  file(id: ID!): File
  models: [Model]
  model(name: String!): Model
  ${models.map(model => `
  ${model.listQueryName}: [${model.name}]
  ${model.itemQueryName}(id: ID!): ${model.name}
  `).join('')}`

exports.createQueries = (models) => {
  let modelsByName = null
  return Object.assign(
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
}