// @flow weak

const { buildASTSchema, parse } = require('graphql')
const pluralize = require('pluralize')

const getDirective = (type, directiveName) => (
  type.astNode.directives.find(d => d.name.value === directiveName)
)

const getFields = (model) => {
  return Object.values(model._fields)
  .filter(field => getDirective(field, 'field'))
  .map(field => {
    return {
      name: field.name,
      type: (field.astNode.type.type || field.astNode.type).name.value,
      list: field.astNode.type.kind === 'ListType',
      required: field.astNode.type.kind === 'NonNullType',
      fields: field.type._fields ? getFields(field.type) : [],
    }
  })
}

const getItemQueryName = ({ name }) => (
  name.charAt(0).toLowerCase() + name.slice(1)
)

const getListQueryName = ({ name }) => (
  name.charAt(0).toLowerCase() + pluralize(name).slice(1)
)

const getModels = (schema) => {
  const ast = buildASTSchema(parse(schema))
  return ast._implementations.Node.map(model => {
    return {
      name: model.name,
      fields: getFields(model),
    }
  })
}

module.exports = {
  getModels,
  getItemQueryName,
  getListQueryName,
}
