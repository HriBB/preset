// @flow weak

const { resolve } = require('path')
const { buildASTSchema, parse } = require('graphql')
const { importSchema } = require('graphql-import')
const pluralize = require('pluralize')

const schema = importSchema(resolve(__dirname, 'preset.graphql'))

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

const getItemQuery = ({ name }) => (
  name.charAt(0).toLowerCase() + name.slice(1)
)

const getListQuery = ({ name }) => (
  name.charAt(0).toLowerCase() + pluralize(name).slice(1)
)

const getModels = (ast) => {
  return ast._implementations.Node.map(model => {
    return {
      name: model.name,
      fields: getFields(model),
      itemQuery: getItemQuery(model),
      listQuery: getListQuery(model),
    }
  })
}

const ast = buildASTSchema(parse(schema))

const models = getModels(ast)

module.exports = models
