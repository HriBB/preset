// @flow

import { hasQuery } from 'apollo'
import pagesQuery from '../queries/pages.graphql'

const createPageUpdate = (client: any) => (proxy: any, { data }: any) => {
  if (hasQuery(client, pagesQuery)) {
    const query = pagesQuery
    const data = proxy.readQuery({ query })
    data.pages.push(data.createPage)
    proxy.writeQuery({ query, data })
  }
}

export default createPageUpdate
