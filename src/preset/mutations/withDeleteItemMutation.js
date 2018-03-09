// @flow weak

import React from 'react'
import gql from 'graphql-tag'

const withDeleteItemMutation = (WrappedComponent: any) => (props: any) => {
  const { model: { deleteMutationName } } = props
  const deleteMutation = gql(`
    mutation ${deleteMutationName}($id: ID!) {
      ${deleteMutationName}(id: $id) {
        id
      }
    }
  `)
  console.log(
    deleteMutation.loc &&
    deleteMutation.loc.source && 
    deleteMutation.loc.source.body
  )
  return (
    <WrappedComponent
      deleteMutation={deleteMutation}
      deleteMutationName={deleteMutationName}
      {...props}
    />
  )
}

export default withDeleteItemMutation