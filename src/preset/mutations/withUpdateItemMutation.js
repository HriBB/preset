// @flow

import React from 'react'
import gql from 'graphql-tag'

import {
  getMutationArgs,
  getMutationFields,
  getModelFields,
} from 'preset/utils'

const withUpdateItemMutation = (WrappedComponent: any) => (props: any) => {
  const { model: { fields, updateMutationName } } = props
  const updateMutation = gql(`
    mutation ${updateMutationName}($id: ID!, ${getMutationArgs(fields)}) {
      ${updateMutationName}(id: $id, ${getMutationFields(
    fields
  )}) ${getModelFields(fields)}
    }
  `)
  //console.log(updateMutation.loc.source.body)
  return (
    <WrappedComponent
      updateMutation={updateMutation}
      updateMutationName={updateMutationName}
      {...props}
    />
  )
}

export default withUpdateItemMutation
