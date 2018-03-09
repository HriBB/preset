// @flow weak

const fs = require('fs')
const mkdirp = require('mkdirp')
const shortid = require('shortid')
const pluralize = require('pluralize')

const config = require('config')

const findDirective = (type, directiveName) => (
  type.astNode.directives.find(d => d.name.value === directiveName)
)

/*
const findDirectiveArgument = (directive, argumentName) => (
  directive.arguments.find(a => a.name.value === argumentName)
)

const getDirectiveArgument = (type, directiveName, argumentName) => {
  const directive = findDirective(type, directiveName)
  if (directive) {
    const argument = findDirectiveArgument(directive, argumentName)
    if (argument) {
      return argument.value.value
    }
  }
}
*/

const getDirectiveArguments = (type, directiveName) => {
  const directive = findDirective(type, directiveName)
  if (!directive) return {}
  return directive.arguments.reduce((args, { name, value }) => (
    Object.assign(args, { [name.value]: value.value })
  ), {})
}

const getItemQueryName = ({ name }) => (
  name.charAt(0).toLowerCase() + name.slice(1)
)

const getListQueryName = ({ name }) => (
  name.charAt(0).toLowerCase() + pluralize(name).slice(1)
)

const getModelFields = (model) => {
  return Object.values(model._fields)
  .filter(field => findDirective(field, 'field'))
  .map(field => {
    return {
      name: field.name,
      type: (field.astNode.type.type || field.astNode.type).name.value,
      list: field.astNode.type.kind === 'ListType',
      required: field.astNode.type.kind === 'NonNullType',
      fields: field.type._fields ? getModelFields(field.type) : [],
      ...getDirectiveArguments(field, 'field'),
    }
  })
}

const getModels = (ast) => {
  return ast._implementations.Preset.map(model => {
    return {
      name: model.name,
      listQueryName: getListQueryName(model),
      itemQueryName: getItemQueryName(model),
      createMutationName: `create${model.name}`,
      updateMutationName: `update${model.name}`,
      deleteMutationName: `delete${model.name}`,
      fields: getModelFields(model),
      ...getDirectiveArguments(model, 'model'),
    }
  })
}

const uploadFile = async (image) => {
  const { stream, filename: originalname, mimetype } = await image
  const filename = `${shortid.generate()}-${originalname.replace(' ', '-')}`
  const path = `${config.uploads.path}/${filename}`
  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(path))
      .on('finish', () => resolve({ filename, mimetype }))
      .on('error', reject),
  )
}

mkdirp.sync(config.uploads.path)

module.exports = {
  getModels,
  uploadFile,
}
