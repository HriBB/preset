import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
})

export default client

export const hasQuery = (client: any, query: any) => {
  const name = typeof query === 'string' ? query : query.definitions[0].name.value
  return client.queryManager.queryIdsByName[name]
}
