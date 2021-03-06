// @flow weak

const { getUserId } = require('user')
const { uploadFile } = require('utils')

const models = require('./models')

const createFile = async (image, ctx) => {
  const { filename, mimetype } = await uploadFile(image)
  return ctx.db.mutation.createFile({ data: { filename, mimetype } })
}

const createModel = (model) => async (parent, { image, ...args }, ctx, info) => {
  const userId = getUserId(ctx)
  const data = { ...args, author: { connect: { id: userId } } }
  if (image && image instanceof Promise) {
    const file = await createFile(image, ctx)
    Object.assign(data, { image: { connect: { id: file.id } } })
  }
  return ctx.db.mutation[`create${model.name}`]({ data }, info)
}

const updateModel = (model) => async (parent, input, ctx, info) => {
  getUserId(ctx)
  const { id, image, ...data } = input
  const exists = await ctx.db.exists[model.name]({ id })
  if (!exists) {
    throw new Error(`${model.name} not found!`)
  }
  if (image && image instanceof Promise) {
    const file = await createFile(image, ctx)
    Object.assign(data, { image: { connect: { id: file.id } } })
  }
  return ctx.db.mutation[`update${model.name}`]({ data, where: { id } }, info)
}

const deleteModel = (model) => async (parent, { id }, ctx, info) => {
  getUserId(ctx)
  const exists = await ctx.db.exists[model.name]({ id })
  if (!exists) {
    throw new Error(`${model.name} not found!`)
  }
  return ctx.db.mutation[`delete${model.name}`]({ where: { id } })
}

const mutations = models.reduce((mutations, model) => ({
  ...mutations,
  [`create${model.name}`]: createModel(model),
  [`update${model.name}`]: updateModel(model),
  [`delete${model.name}`]: deleteModel(model),
}), {})

module.exports = mutations