// @flow weak

import gql from 'graphql-tag'
import pluralize from 'pluralize'

import { hasQuery } from 'apollo'

const nameField = {}
const itemQuery = {}
const listQuery = {}
const createMutation = {}
const updateMutation = {}
const deleteMutation = {}

// types
// @todo import introspection types from graphql/?

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

const getItemQueryName = ({ name }: Model) => {
  return name.charAt(0).toLowerCase() + name.slice(1)
}

const getListQueryName = ({ name }: Model) => {
  return name.charAt(0).toLowerCase() + pluralize(name.slice(1))
}

const getQueryFields = ({ name, models }: Model) => {
  const model = models.find(m => m.name === name)
  const fields = model && model.fields ? model.fields : []
  return `{
    ${fields
    .filter(({ name, type }) => (
      type.kind !== 'OBJECT' ||
      type.name === 'File'
    ))
    .map(({ name, type }) => 
      type.name === 'File'
        ? `${name} ${getQueryFields({ name: type.name, models })}`
        : name
    )
    .join(' ')}
  }`
}

const getMutationArgs = ({ fields }: Model) => {
  return fields
    .filter(f => f.name !== 'id')
    .map(({ name, type }) => {
      const required = type.kind === 'NON_NULL' ? '!' : ''
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

const getModel = ({ model, schema }: any) => {
  return {
    ...model,
    models: schema.types.filter(t => (
      t.kind === 'OBJECT' &&
      t.name !== 'Query' &&
      t.name !== 'Mutation' &&
      t.name !== 'Model' &&
      t.name !== 'Field' &&
      t.name.charAt(0) !== '_'
    )),
  }
}

const getFieldType = ({ name, type }: Field) => {
  const { ofType } = type
  return type.name ? type.name : ofType ? ofType.name : name
}

const getNameField = ({ name, fields }: Model) => {
  if (!nameField[name]) {
    for (let field of fields) {
      if (field.type.ofType && field.type.ofType.name === 'Text') {
        nameField[name] = field.name
        break
      }
    }
  }
  return nameField[name]
}

const getInitialValues = ({ fields }: Model) => {
  return fields
    .reduce((values, field) => {
      const { name } = field
      const type = getFieldType(field)
      if (type === 'Checkbox') {
        values[name] = false
      }
      return values
    }, {})
}

// queries
// create dynamic queries based on introspection model

const getItemQuery = (model: Model) => {
  if (!itemQuery[model.name]) {
    const queryName = getItemQueryName(model)
    const queryFields = getQueryFields(model)
    itemQuery[model.name] = gql(`
      query ${queryName}($id: ID!) {
        item: ${queryName}(id: $id) ${queryFields}
      }
    `)
  }
  return itemQuery[model.name]
}

const getListQuery = (model: Model) => {
  if (!listQuery[model.name]) {
    const queryName = getListQueryName(model)
    const queryFields = getQueryFields(model)
    listQuery[model.name] = gql(`
      query ${queryName} {
        items: ${queryName} ${queryFields}
      }
    `)
  }
  return listQuery[model.name]
}

// mutations
// create dynamic mutations based on introspection model


const getCreateMutation = (model: Model) => {
  if (!createMutation[model.name]) {
    const args = getMutationArgs(model)
    const vars = getMutationVars(model)
    const fields = getQueryFields(model)
    createMutation[model.name] = gql(`
      mutation create${model.name}(${args}) {
        create${model.name}(${vars}) ${fields}
      }
    `)
  }
  return createMutation[model.name]
}

const getUpdateMutation = (model: Model) => {
  if (!updateMutation[model.name]) {
    const args = getMutationArgs(model)
    const vars = getMutationVars(model)
    const fields = getQueryFields(model)
    updateMutation[model.name] = gql(`
      mutation update${model.name}($id: ID!, ${args}) {
        update${model.name}(id: $id, ${vars}) ${fields}
      }
    `)
  }
  return updateMutation[model.name]
}

const getDeleteMutation = (model: Model) => {
  if (!deleteMutation[model.name]) {
    deleteMutation[model.name] = gql(`
      mutation delete${model.name}($id: ID!) {
        delete${model.name}(id: $id) {
          id
        }
      }
    `)
  }
  return deleteMutation[model.name]
}

// mutation variables
// we need to do some parsing before we send data back to the server

const getCreateVariables = (props: Props, data) => {
  return props.model.fields
    .filter(f => f.name !== 'id')
    .reduce((obj, field) => {
      const { name } = field
      const type = getFieldType(field)
      if (!data.hasOwnProperty(name)) {
        obj[name] = null
      } else if (type === 'File') {
        obj[name] = field.type.kind !== 'LIST'
          ? data[name] && data[name].length ? data[name][0] : null
          : data[name]
      } else {
        obj[name] = data[name]
      }
      return obj
    }, {})
}

const getUpdateVariables = (props: Props, data) => ({
  id: data.id,
  ...getCreateVariables(props, data),
})

// mutation apollo cache updaters
// these functions create functions that
// will update apollo cache after a mutation

const getCreateUpdateHandler = (props: Props) => (proxy: any, { data }: any) => {
  const { client, model } = props
  const newItem = data[`create${model.name}`]
  const queryName = getListQueryName(model)
  if (hasQuery(client, queryName)) {
    const query = getListQuery(model)
    const data = proxy.readQuery({ query })
    data.items.push(newItem)
    proxy.writeQuery({ query, data })
  }
}

const getUpdateUpdateHandler = (id: string, props: Props) => (proxy: any, { data }: any) => {
  const { client, model } = props
  const newItem = data[`update${model.name}`]
  const queryName = getListQueryName(model)
  if (hasQuery(client, queryName)) {
    const query = getListQuery(model)
    const data = proxy.readQuery({ query })
    const index = data.items.findIndex(i => i.id === id)
    data.items[index] = newItem
    proxy.writeQuery({ query, data })
  }
}

const getDeleteUpdateHandler = (id: string, props: Props) => (proxy: any, { data }: any) => {
  const { client, model } = props
  const { id } = data[`delete${model.name}`]
  const queryName = getListQueryName(model)
  if (hasQuery(client, queryName)) {
    const query = getListQuery(model)
    const data = proxy.readQuery({ query })
    data.items = data.items.filter(i => i.id !== id)
    proxy.writeQuery({ query, data })
  }
}

module.exports = {
  getModel,
  getFieldType,
  getNameField,
  getInitialValues,
  getItemQuery,
  getListQuery,
  getCreateMutation,
  getUpdateMutation,
  getDeleteMutation,
  getCreateVariables,
  getUpdateVariables,
  getCreateUpdateHandler,
  getUpdateUpdateHandler,
  getDeleteUpdateHandler,
}
