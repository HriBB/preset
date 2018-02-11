// @flow

import React from 'react'
import gql from 'graphql-tag'

const withListQuery = (WrappedComponent: any) => (props: any) => {
  const { model: { listQueryName, fields } } = props
  const query = gql(`
    query ${listQueryName} {
      items: ${listQueryName} {
        id ${fields.map(f => f.name).join(' ')}
      }
    }
  `)
  return (
    <WrappedComponent
      listQuery={query}
      listQueryName={listQueryName}
      {...props}
    />
  )
}

export default withListQuery
