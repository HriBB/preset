// @flow weak

const { getUserId } = require('user')
const { uploadFile } = require('utils')

const field = ({ name, type, required }) => 
  `${name}: ${type === 'File' ? 'Upload' : type}${required ? '!' : ''}`

exports.createMutationText = (models) =>
  models.map(({ name, fields }, i) => `
  create${name}(${fields.map(field).join(', ')}): ${name}
  update${name}(id: ID!, ${fields.map(field).join(', ')}): ${name}
  delete${name}(id: ID!): ${name}
  `).join('')

const createModel = (model) => async (parent, { image, ...args }, ctx, info) => {
  const { createMutationName } = model
  const userId = getUserId(ctx)
  const data = {
    ...args,
    author: { connect: { id: userId } },
  }
  if (image && image instanceof Promise) {
    const { filename, mimetype } = await uploadFile(image)
    const file = await ctx.db.mutation.createFile(
      { data: { filename, mimetype } },
    )
    Object.assign(data, {
      image: { connect: { id: file.id } },
    })
  }
  return ctx.db.mutation[createMutationName](
    { data },
    info
  )
}

const updateModel = (model) => async (parent, input, ctx, info) => {
  getUserId(ctx)
  const { name, updateMutationName } = model
  const { id, image, ...args } = input
  const exists = await ctx.db.exists[name]({ id })
  if (!exists) {
    throw new Error(`${name} not found or you're not the owner!`)
  }
  const data = args
  if (image && image instanceof Promise) {
    const { filename, mimetype } = await uploadFile(image)
    const file = await ctx.db.mutation.createFile(
      { data: { filename, mimetype } },
    )
    Object.assign(data, {
      image: { connect: { id: file.id } },
    })
  }
  return ctx.db.mutation[updateMutationName](
    {
      data,
      where: { id },
    },
    info,
  )
}

const deleteModel = (model) => async (parent, { id }, ctx, info) => {
  getUserId(ctx)
  const { name, deleteMutationName } = model
  const exists = await ctx.db.exists[name]({ id })
  if (!exists) {
    throw new Error(`${name} not found or you're not the owner!`)
  }
  return ctx.db.mutation[deleteMutationName]({ where: { id } })
}

exports.createMutations = (models) => (
  models.reduce((mutations, model) => ({
    ...mutations,
    [model.createMutationName]: createModel(model),
    [model.updateMutationName]: updateModel(model),
    [model.deleteMutationName]: deleteModel(model),
  }), {})
)
