// @flow

import React from 'react'
import gql from 'graphql-tag'

import { getMutationArgs, getMutationFields } from 'preset/utils'

const withUpdateItemMutation = (WrappedComponent: any) => (props: any) => {
  const { model: { fields, updateMutationName } } = props
  const mutation = gql(`
    mutation ${updateMutationName}($id: ID!, ${getMutationArgs(fields)}) {
      ${updateMutationName}(id: $id, ${getMutationFields(fields)}) {
        id ${fields.map(f => f.name).join(' ')}
      }
    }
  `)
  return (
    <WrappedComponent
      updateMutation={mutation}
      updateMutationName={updateMutationName}
      {...props}
    />
  )
}

export default withUpdateItemMutation