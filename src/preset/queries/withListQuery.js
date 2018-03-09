// @flow

import React from 'react'
import gql from 'graphql-tag'

import { getModelFields } from 'preset/utils'

const withListQuery = (WrappedComponent: any) => (props: any) => {
  const { model: { listQueryName, fields } } = props
  const query = gql(`
    query ${listQueryName} {
      items: ${listQueryName} ${getModelFields(fields)}
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
