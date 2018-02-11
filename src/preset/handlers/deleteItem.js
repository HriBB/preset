// @flow

import { hasQuery } from 'preset/utils'

const deleteItem = (props: any) => (e: any) => {
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
    const result = data[deleteMutationName]
    console.log(result)
  })
  .catch(error => {
    console.log(error)
  })
}

export default deleteItem
