// @flow

import React from 'react'
import gql from 'graphql-tag'

import { getModelFields } from 'preset/utils'

const withItemQuery = (WrappedComponent: any) => (props: any) => {
  const { model: { fields, itemQueryName } } = props
  const query = gql(`
    query ${itemQueryName}($id: ID!) {
      item: ${itemQueryName}(id: $id) ${getModelFields(fields)}
    }
  `)
  return (
    <WrappedComponent
      itemQuery={query}
      itemQueryName={itemQueryName}
      {...props}
    />
  )
}

export default withItemQuery
