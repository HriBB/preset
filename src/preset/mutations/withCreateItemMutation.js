// @flow

import React from 'react'
import gql from 'graphql-tag'

import { getMutationArgs, getMutationFields } from 'preset/utils'

const withCreateItemMutation = (WrappedComponent: any) => (props: any) => {
  const { model: { fields, createMutation } } = props
  const mutation = gql(`
    mutation ${createMutation}(${getMutationArgs(fields)}) {
      ${createMutation}(${getMutationFields(fields)}) {
        id ${fields.map(f => f.name).join(' ')}
      }
    }
  `)
  return (
    <WrappedComponent
      createMutation={mutation}
      createMutationName={createMutation}
      {...props}
    />
  )
}

export default withCreateItemMutation