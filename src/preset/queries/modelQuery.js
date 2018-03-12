// @flow

import gql from 'graphql-tag'

const modelQuery = gql`
  query model($name: String!) {
    model: model(name: $name) {
      name
      label
      single
      itemQueryName
      listQueryName
      createMutationName
      updateMutationName
      deleteMutationName
      fields {
        name
        label
        type
        list
        required
        fields {
          name
          label
          type
          list
          required
        }
      }
    }
  }
`

export default modelQuery
