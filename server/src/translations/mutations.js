// @flow weak

const updateTranslations = async (parent, { data }, ctx, info) => {
  return Promise.all(
    data.map(({ id, ...data }) => 
      id
        ? ctx.db.mutation.updateTranslation({ data, where: { id } })
        : ctx.db.mutation.createTranslation({ data })
    )
  )
}

module.exports = {
  updateTranslations,
}