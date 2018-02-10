// @flow

import React from 'react'
import { Query, withApollo } from 'react-apollo'
import gql from 'graphql-tag'

import { getTypeQueryFields } from './utils'

import Form from './Form'

const Edit = (props) => {
  const { match, type } = props
  const query = gql`
    query ${type.name}Query($id: ID!) {
      item: ${type.name.toLowerCase()}(id: $id) {
        ${getTypeQueryFields(type)}
      }
    }
  `
  return (
    <Query query={query} variables={{ id: match.params.id }}>
      {({ error, loading, data }) => {
        if (error) return (<p>{error.message}<br />{error.stack}</p>)
        if (loading) return (<p>Loading ...</p>)
        const { item } = data
        return (
          <div>
            <Form
              form={`${type.name}${item.id}`}
              initialValues={item}
              onSubmit={props.onSubmit}
              type={type}
            />
          </div>
        )
      }}
    </Query>
  )
}

export default withApollo(Edit)
