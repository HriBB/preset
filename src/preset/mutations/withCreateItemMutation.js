// @flow

import React from 'react'
import gql from 'graphql-tag'

import {
  getMutationArgs,
  getMutationFields,
  getModelFields,
} from 'preset/utils'

const withCreateItemMutation = (WrappedComponent: any) => (props: any) => {
  const { model: { fields, createMutationName } } = props
  const createMutation = gql(`
    mutation ${createMutationName}(${getMutationArgs(fields)}) {
      ${createMutationName}(${getMutationFields(fields)}) ${getModelFields(
    fields
  )}
    }
  `)
  return (
    <WrappedComponent
      createMutation={createMutation}
      createMutationName={createMutationName}
      {...props}
    />
  )
}

export default withCreateItemMutation
