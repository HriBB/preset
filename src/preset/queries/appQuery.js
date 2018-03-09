// @flow

import gql from 'graphql-tag'

const appQuery = gql`
  query app {
    user: viewer {
      id
      username
      email
      image {
        id
        url
        filename
      }
    }
    models: models {
      name
      label
    }
  }
`

export default appQuery
