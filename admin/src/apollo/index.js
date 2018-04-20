import { ApolloClient } from 'apollo-client'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import { getMainDefinition } from 'apollo-utilities'

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});

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

const httpLink = authLink.concat(uploadLink)

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache()

const client = new ApolloClient({ link, cache })

export default client

export const hasQuery = (client: any, query: any) => {
  const name = typeof query === 'string' ? query : query.definitions[0].name.value
  return client.queryManager.queryIdsByName[name]
}
