// @flow

import { hasQuery } from 'apollo'
import pagesQuery from '../queries/pages.graphql'

const deletePageUpdate = (client: any) => (proxy: any, { data }: any) => {
  if (hasQuery(client, pagesQuery)) {
    const query = pagesQuery
    const data = proxy.readQuery({ query })
    const index = data.pages.findIndex(p => p.id === data.deletePage.id)
    if (index > -1) {
      data.pages.splice(index, 1)
      proxy.writeQuery({ query, data })
    }
  }
}

export default deletePageUpdate
