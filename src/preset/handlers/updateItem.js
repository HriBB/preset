// @flow

import { hasQuery } from 'preset/utils'

const updateItem = (props: any) => (data: any) => {
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
    const result = data[updateMutationName]
    console.log(result)
  })
  .catch(error => {
    console.log(error)
  })
}

export default updateItem
