// @flow

import { hasQuery } from 'preset/utils'

const createItem = (props: any) => (data: any) => {
  const { client, itemsQuery, createMutation, createMutationName } = props
  return client.mutate({
    mutation: createMutation,
    variables: data,
    update: (proxy, { data: result }) => {
      const item = result[createMutationName]
      if (hasQuery(proxy, itemsQuery)) {
        const data = proxy.readQuery({ query: itemsQuery })
        data.items.push(item)
        proxy.writeQuery({ query: itemsQuery, data })
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

export default createItem
