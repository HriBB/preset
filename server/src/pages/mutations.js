// @flow weak

const { getUserId } = require('user')

const createPage = async (parent, { data }, ctx, info) => {
  const userId = getUserId(ctx)
  /*
  if (image && image instanceof Promise) {
    const file = await createFile(image, ctx)
    Object.assign(data, { image: { connect: { id: file.id } } })
  }
  */
  return ctx.db.mutation.createPage({
    data: {
      title: data.title,
      slug: data.slug,
      content: JSON.stringify(data.content),
      author: { connect: { id: userId } },
    },
  })
}

const updatePage = async (parent, { id, data }, ctx, info) => {
  const userId = getUserId(ctx)
  const exists = await ctx.db.exists.Page({ id })
  if (!exists) {
    throw new Error('Page not found!')
  }
  const { title, slug, content } = data
  return ctx.db.mutation.updatePage({
    data: { title, slug, content: JSON.stringify(content) },
    where: { id },
  })
}

const deletePage = async (parent, { id }, ctx, info) => {
  getUserId(ctx)
  const exists = await ctx.db.exists.page({ id })
  if (!exists) {
    throw new Error('Page not found!')
  }
  return ctx.db.mutation.deletePage({ where: { id } })
}

const runScript = require('npm-run-script')
 

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    const child = runScript(command, { stdio: 'ignore' })
    child.once('error', error => reject(error))
    child.once('exit', exitCode => resolve(exitCode))
  })
}

module.exports = {
  createPage,
  updatePage,
  deletePage,
}

