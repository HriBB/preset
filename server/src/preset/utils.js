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

const getModels = (typeDefs) => {
  const ast = buildASTSchema(parse(typeDefs))
  return ast._implementations.Node.map(model => {
    const { name } = model
    return {
      name,
      fields: getFields(model),
      itemQuery: name.charAt(0).toLowerCase() + name.slice(1),
      listQuery: name.charAt(0).toLowerCase() + pluralize(name).slice(1),
      createMutation: `create${name}`,
      updateMutation: `update${name}`,
      deleteMutation: `delete${name}`,
    }
  })
}

module.exports = {
  getModels,
}
