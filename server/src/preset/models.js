// @flow weak

const { buildASTSchema, parse } = require('graphql')
const pluralize = require('pluralize')

const schema = require('./schema')

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
  return ast._implementations.Node.map(model => {
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


const ast = buildASTSchema(parse(schema))
const models = getModels(ast)

module.exports = models
