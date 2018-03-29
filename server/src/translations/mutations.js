// @flow weak

const updateTranslations = async (parent, { language, messages }, ctx, info) => {
  const lang = language.toUpperCase()

  const where = { OR: [] }
  for (let ns of Object.keys(messages)) {
    for (let key of Object.keys(messages[ns])) {
      where.OR.push({ lang, ns, key })
    }
  }

  const create = []
  const update = []
  const existing = await ctx.db.query.translations({ where })
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

module.exports = {
  updateTranslations,
  setTranslationEditor,
}