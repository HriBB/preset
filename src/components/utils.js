// @flow

import React from 'react'
import parse from 'parse-key-value'
import gql from 'graphql-tag'

export function getSchemaModules(schema: any) {
  return schema.types.filter(type =>
    type.kind === 'OBJECT' &&
    type.interfaces.length &&
    type.interfaces[0].name === 'Node'
  )
}

export function getTypeNameField({ fields }: any) {
  for (let field of fields) {
    if (
      field.type.ofType.kind === 'SCALAR' &&
      field.type.ofType.name === 'String'
    ) {
      return field.name
    }
  }
}

export function getTypeQueryFields({ fields }: any) {
  return fields
    .filter(({ name, args }) => 
      name !== 'password' &&
      args.length === 0
    )
    .map(({ name }) => name)
    .join(' ')
}

export function getTypeFormFields({ fields }: any) {
  return fields
    .filter(({ name, description, type }) =>
      type.ofType.kind === 'SCALAR' &&
      description
    )
    .map(({ name, description, type }) => {
      return {
        name,
        type: type.ofType,
        ...parse(description)
      }
    })
}

export function getTypeUpdateFields({ fields }: any) {
  return fields
    .filter(({ name, description, type }) =>
      name === 'id' ||
      (type.ofType.kind === 'SCALAR' && description )
    )
    .map(({ name }) => name)
}

export const withListQuery = (WrappedComponent: any) => (props: any) => {
  const { type } = props
  const queryName = `${type.name.toLowerCase()}s`
  const query = gql`
    query ${queryName} {
      items: ${queryName} {
        ${getTypeQueryFields(type)}
      }
    }
  `
  return (
    <WrappedComponent
      listQuery={query}
      {...props}
    />
  )
}

export const withItemQuery = (WrappedComponent: any) => (props: any) => {
  const { type } = props
  const queryName = type.name.toLowerCase()
  const query = gql`
    query ${queryName}($id: ID!) {
      item: ${queryName}(id: $id) {
        ${getTypeQueryFields(type)}
      }
    }
  `
  return (
    <WrappedComponent
      itemQuery={query}
      {...props}
    />
  )
}

export const withCreateItemMutation = (WrappedComponent: any) => (props: any) => {
  const { type } = props
  const { name } = type
  const mutationName = `create${name}`
  const fields = getTypeFormFields(type)
  const vars1 = fields.map(f => `$${f.name}: ${f.type.name}!`).join(', ')
  const vars2 = fields.map(f => `${f.name}: $${f.name}`).join(', ')
  const mutation = gql`
    mutation ${mutationName}(${vars1}) {
      ${mutationName}(${vars2}) {
        ${getTypeQueryFields(type)}
      }
    }
  `
  return (
    <WrappedComponent
      createMutation={mutation}
      createMutationName={mutationName}
      {...props}
    />
  )
}

export const withUpdateItemMutation = (WrappedComponent: any) => (props: any) => {
  const { type } = props
  const { name } = type
  const mutationName = `update${name}`
  const fields = getTypeFormFields(type)
  const vars1 = fields.map(f => `$${f.name}: ${f.type.name}!`).join(', ')
  const vars2 = fields.map(f => `${f.name}: $${f.name}`).join(', ')
  const mutation = gql`
    mutation ${mutationName}($id: ID!, ${vars1}) {
      ${mutationName}(id: $id, ${vars2}) {
        ${getTypeQueryFields(type)}
      }
    }
  `
  return (
    <WrappedComponent
      updateMutation={mutation}
      updateMutationName={mutationName}
      {...props}
    />
  )
}

export const withDeleteItemMutation = (WrappedComponent: any) => (props: any) => {
  const { type } = props
  const mutationName = `delete${type.name}`
  const mutation = gql`
    mutation ${mutationName}($id: ID!) {
      ${mutationName}(id: $id) {
        id
      }
    }
  `
  return (
    <WrappedComponent
      deleteMutation={mutation}
      deleteMutationName={mutationName}
      {...props}
    />
  )
}

function hasQuery(proxy, query) {
  return !!proxy.watches.find(watch => 
    watch.query.definitions[0].name.value === query.definitions[0].name.value
  )
}

export const createItem = (props: any) => (data: any) => {
  const { client, listQuery, createMutation, createMutationName } = props
  return client.mutate({
    mutation: createMutation,
    variables: data,
    update: (proxy, { data: result }) => {
      const item = result[createMutationName]
      if (hasQuery(proxy, listQuery)) {
        const data = proxy.readQuery({ query: listQuery })
        data.items.push(item)
        proxy.writeQuery({ query: listQuery, data })
      }
    },
  })
    .then(({ data }) => {
      const result = data[createMutationName]
      console.log(result)
    })
    .catch(error => {
      console.log(error)
    })
}

export const updateItem = (props: any) => (data: any) => {
  const { client, listQuery, updateMutation, updateMutationName } = props
  const { __typename, ...variables } = data
  const update = (proxy, { data: result }) => {
    const newItem = result[updateMutationName]
    if (hasQuery(proxy, listQuery)) {
      const { id } = variables
      const data = proxy.readQuery({ query: listQuery })
      const index = data.items.findIndex(i => i.id === id)
      data.items[index] = newItem
      proxy.writeQuery({ query: listQuery, data })
    }
  }
  return client
  .mutate({
    mutation: updateMutation,
    variables,
    update,
  })
  .then(({ data }) => {
    //const result = data[updateMutationName]
  })
  .catch(error => {
    console.log(error)
  })
}

export const deleteItem = (props: any) => (e: any) => {
  const { id } = e.currentTarget.dataset
  const { client, listQuery, deleteMutation, deleteMutationName } = props
  const update = (proxy, { data: result }) => {
    const { id } = result[deleteMutationName]
    if (hasQuery(proxy, listQuery)) {
      const data = proxy.readQuery({ query: listQuery })
      data.items = data.items.filter(i => i.id !== id)
      proxy.writeQuery({ query: listQuery, data })
    }
  }
  return client
  .mutate({
    mutation: deleteMutation,
    variables: { id },
    update,
  })
  .then(({ data }) => {
    //const result = data[deleteMutationName]
  })
  .catch(error => {
    console.log(error)
  })
}