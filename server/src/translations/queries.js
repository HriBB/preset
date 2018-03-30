// @flow weak

exports.translations = async (parent, { lang, ns }, ctx, info) => {
  return ctx.db.query.translations({
    where: {
      lang: lang && lang.toUpperCase(),
      ns_in: ns,
    },
  })
}
