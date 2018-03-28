// @flow weak

const { getUserId } = require('user')
const { uploadFile } = require('utils')

const models = require('./models')

const updateTranslations = async (parent, { language, messages }, ctx, info) => {
  const lang = language.toUpperCase()

  const where = { OR: [] }
  
  for (let ns of Object.keys(messages)) {
    for (let key of Object.keys(messages[ns])) {
      where.OR.push({ lang, ns, key })
    }
  }

  const existing = await ctx.db.query.translations({ where })

  const create = []
  const update = []

  for (let ns of Object.keys(messages)) {
    for (let key of Object.keys(messages[ns])) {
      const findKey = t => t.lang === lang && t.ns === ns && t.key === key
      const exists = existing.find(findKey)
      if (exists) {
        update.push(
          ctx.db.mutation.updateTranslation({
            data: { value: messages[ns][key] },
            where: { id: exists.id },
          })
        )
      } else {
        create.push(
          ctx.db.mutation.createTranslation({
            data: { lang, ns, key, value: messages[ns][key] },
          })
        )
      }
    }
  }

  if (create.length) {
    await Promise.all(create)
  }

  if (update.length) {
    await Promise.all(update)
  }
}

const setTranslationEditor = async (parent, { lang, ns, key, editor }, ctx, info) => {
  lang = lang.toUpperCase()
  const [translation] = await ctx.db.query.translations({
    where: { AND: [{ lang }, { ns }, { key }] },
  })
  if (translation) {
    return ctx.db.mutation.updateTranslation({
      data: { editor },
      where: { id: translation.id },
    })
  } else {
    return ctx.db.mutation.createTranslation({
      data: { lang, ns, key, editor },
    })
  }
}

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

const mutations = Object.assign(
  {
    updateTranslations,
    setTranslationEditor,
  },
  models.reduce((mutations, model) => ({
    ...mutations,
    [model.createMutationName]: createModel(model),
    [model.updateMutationName]: updateModel(model),
    [model.deleteMutationName]: deleteModel(model),
  }), {})
)

module.exports = mutations