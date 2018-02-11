// @flow weak

import React from 'react'
import gql from 'graphql-tag'

const withDeleteItemMutation = (WrappedComponent: any) => (props: any) => {
  const { model: { deleteMutationName } } = props
  const mutation = gql(`
    mutation ${deleteMutationName}($id: ID!) {
      ${deleteMutationName}(id: $id) {
        id
      }
    }
  `)
  return (
    <WrappedComponent
      deleteMutation={mutation}
      deleteMutationName={deleteMutationName}
      {...props}
    />
  )
}

export default withDeleteItemMutation