// @flow weak

const { importSchema } = require('graphql-import')
const config = require('config')

const findDirective = (type, directiveName) => (
  type.astNode.directives.find(d => d.name.value === directiveName)
)

const getDirectiveArguments = (type, directiveName) => {
  const directive = findDirective(type, directiveName)
  if (!directive) return {}
  return directive.arguments.reduce((args, { name, value }) => (
    Object.assign(args, { [name.value]: value.value })
  ), {})
}

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

const schema = importSchema(config.schema)

module.exports = schema