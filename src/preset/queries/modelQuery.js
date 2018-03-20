// @flow

import gql from 'graphql-tag'

const modelQuery = gql`
  query model($name: String!) {
    model: model(name: $name) {
      name
      itemQueryName
      listQueryName
      createMutationName
      updateMutationName
      deleteMutationName
      fields {
        name
        type
        list
        required
        fields {
          name
          type
          list
          required
        }
      }
    }
  }
`

export default modelQuery
