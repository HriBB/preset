// @flow

import React from 'react'
import gql from 'graphql-tag'

const withItemQuery = (WrappedComponent: any) => (props: any) => {
  const { model: { fields, itemQueryName } } = props
  const query = gql(`
    query ${itemQueryName}($id: ID!) {
      item: ${itemQueryName}(id: $id) {
        id ${fields.map(f => f.name).join(' ')}
      }
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