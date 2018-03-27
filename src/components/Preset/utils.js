// @flow weak

import gql from 'graphql-tag'
import pluralize from 'pluralize'

// @todo write some tests

// types
// @todo import types from graphql

type FieldOfType = {
  name: string,
  kind: string,
  ofType: FieldOfType,
}

type FieldType = {
  name: string,
  kind: string,
  ofType: FieldOfType,
}

type Field = {
  name: string,
  description: string,
  type: FieldType,
}

type Model = {
  name: string,
  fields: [Field],
  models: [Model],
}

type Props = {
  client: any,
  model: Model,
}

// private helpers
// @todo investigate introspection schema visitor

const hasQuery = (client, query) => {
  const name = typeof query === 'string' ? query : query.definitions[0].name.value
  return client.queryManager.queryIdsByName[name]
}

const getListQueryName = ({ name }: Model) => {
  return name.charAt(0).toLowerCase() + pluralize(name.slice(1))
}

const getItemQueryName = ({ name }: Model) => {
  return name.charAt(0).toLowerCase() + name.slice(1)
}

const getQueryFields = ({ name, models }: Model) => {
  const model = models.find(m => m.name === name)
  const fields = model && model.fields ? model.fields : []
  return `{ ${fields
    .filter(({ name, type }) => (
      type.kind !== 'OBJECT' ||
      type.name === 'File'
    ))
    .map(({ name, type }) => 
      type.name === 'File'
        ? `${name} ${getQueryFields({ name: type.name, models })}`
        : name
    )
    .join(' ')} }`
}

const getMutationArgs = ({ fields }: Model) => {
  return fields
    .filter(f => f.name !== 'id')
    .map(({ name, type }) => {
      const required = type.kind === 'NOT_NULL' ? '!' : ''
      const t = type.ofType ? type.ofType.name : type.name
      return `$${name}: ${t === 'File' ? 'Upload' : t}${required}`
    })
    .join(', ')
}

const getMutationVars = ({ fields }: Model) => {
  return fields
    .filter(field => field.name !== 'id')
    .map(f => `${f.name}: $${f.name}`)
    .join(', ')
}

// public helpers
// @todo can you do this with directives?

export const getNameField = ({ fields }: Model) => {
  for (let field of fields) {
    if (field.type.ofType && field.type.ofType.name === 'Text') {
      return field.name
    }
  }
}

export const getInitialValues = ({ fields }: Model) => {
  return fields.reduce((values, field) => {
    if (field.default) {
      values[field.name] = field.default
    } else if (field.type === 'Checkbox') {
      values[field.name] = false
    }
    return values
  }, {})
}

// queries
// create dynamic queries based on introspection model
// @todo memoize queries for each model

export const getListQuery = (model: Model) => {
  const queryName = getListQueryName(model)
  const queryFields = getQueryFields(model)
  return gql(`
    query ${queryName} {
      items: ${queryName} ${queryFields}
    }
  `)
}

export const getItemQuery = (model: Model) => {
  const queryName = getItemQueryName(model)
  const queryFields = getQueryFields(model)
  return gql(`
    query ${queryName}($id: ID!) {
      item: ${queryName}(id: $id) ${queryFields}
    }
  `)
}

// mutations
// create dynamic mutations based on introspection model
// @todo memoize mutation for each model

export const getCreateMutation = (model: Model) => {
  const args = getMutationArgs(model)
  const vars = getMutationVars(model)
  const fields = getQueryFields(model)
  return gql(`
    mutation create${model.name}(${args}) {
      create${model.name}(${vars}) ${fields}
    }
  `)  
}

export const getUpdateMutation = (model: Model) => {
  const args = getMutationArgs(model)
  const vars = getMutationVars(model)
  const fields = getQueryFields(model)
  return gql(`
    mutation update${model.name}($id: ID!, ${args}) {
      update${model.name}(id: $id, ${vars}) ${fields}
    }
  `)
}

export const getDeleteMutation = (model: Model) => {
  return gql(`
    mutation delete${model.name}($id: ID!) {
      delete${model.name}(id: $id) {
        id
      }
    }
  `)
}

// mutation variables
// we need to do some parsing before we send data back to the server

export const getCreateVariables = (props: Props, data) => {
  return props.model.fields.reduce((obj, { name, type, list }) => {
    if (!data.hasOwnProperty(name)) {
      obj[name] = null
    } else if (type === 'File') {
      obj[name] = list
        ? data[name]
        : data[name] && data[name].length ? data[name][0] : null
    } else {
      obj[name] = data[name]
    }
    return obj
  }, {})
}

export const getUpdateVariables = (props: Props, data) => ({
  id: data.id,
  ...getCreateVariables(props, data),
})

// mutation apollo cache updaters
// these functions create functions that
// will update apollo cache after a mutation

export const getCreateUpdateHandler = (props: Props) => (proxy, { data: result }) => {
  const { client, model } = props
  const newItem = result[`create${model.name}`]
  const queryName = getListQueryName(model)
  if (hasQuery(client, queryName)) {
    const query = getListQuery(model)
    const data = proxy.readQuery({ query })
    data.items.push(newItem)
    proxy.writeQuery({ query, data })
  }
}

export const getUpdateUpdateHandler = (id: string, props: Props) => (proxy, { data: result }) => {
  const { client, model } = props
  const newItem = result[`update${model.name}`]
  const queryName = getListQueryName(model)
  if (hasQuery(client, queryName)) {
    const query = getListQuery(model)
    const data = proxy.readQuery({ query })
    const index = data.items.findIndex(i => i.id === id)
    data.items[index] = newItem
    proxy.writeQuery({ query, data })
  }
}

export const getDeleteUpdateHandler = (id: string, props: Props) => (proxy, { data: result }) => {
  const { client, model } = props
  const { id } = result[`delete${model.name}`]
  const queryName = getListQueryName(model)
  if (hasQuery(client, queryName)) {
    const query = getListQuery(model)
    const data = proxy.readQuery({ query })
    data.items = data.items.filter(i => i.id !== id)
    proxy.writeQuery({ query, data })
  }
}