// @flow weak

const fs = require('fs')
const path = require('path')
const pluralize = require('pluralize')
const { GraphQLNonNull } = require('graphql')

const findDirective = (type, directiveName) => (
  type.astNode.directives.find(d => d.name.value === directiveName)
)

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

const getDirectiveArguments = (type, directiveName) => {
  const directive = findDirective(type, directiveName)
  if (!directive) return {}
  return directive.arguments.reduce((args, { name, value }) => (
    Object.assign(args, { [name.value]: value.value })
  ), {})
}

const getTypeFields = (type) => (
  Object.values(type._fields)
    .filter(field => findDirective(field, 'field'))
    .map(field => ({
      name: field.name,
      type: (field.astNode.type.type || field.astNode.type).name.value,
      required: field.astNode.type.kind === 'NonNullType',
      ...getDirectiveArguments(field, 'field'),
    }))
)

const getItemQueryName = ({ name }) => (
  name.charAt(0).toLowerCase() + name.slice(1)
)

const getListQueryName = ({ name }) => (
  name.charAt(0).toLowerCase() + pluralize(name).slice(1)
)

exports.getModels = (ast) => (
  ast._implementations.Preset
    .filter(type => findDirective(type, 'preset'))
    .map(type => ({
      name: type.name,
      listQueryName: getListQueryName(type),
      itemQueryName: getItemQueryName(type),
      createMutationName: `create${type.name}`,
      updateMutationName: `update${type.name}`,
      deleteMutationName: `delete${type.name}`,
      fields: getTypeFields(type),
      ...getDirectiveArguments(type, 'preset'),
    }))
)
