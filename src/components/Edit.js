// @flow

import React from 'react'
import { compose, withHandlers } from 'recompose'
import { Query, withApollo } from 'react-apollo'

import {
  withListQuery,
  withItemQuery,
  withUpdateItemMutation,
  updateItem,
} from './utils'

import Form from './Form'

const Edit = (props) => {
  const { match, itemQuery, updateItem, type } = props
  return (
    <Query query={itemQuery} variables={{ id: match.params.id }}>
      {({ error, loading, data }) => {
        if (error) return (<p>{error.message}<br />{error.stack}</p>)
        if (loading) return (<p>Loading ...</p>)
        const { item } = data
        if (!item) return (<p>{`Item not found!`}</p>)
        return (
          <Form
            button={`Save`}
            title={`Edit ${type.name}`}
            form={`Edit${type.name}`}
            initialValues={item}
            onSubmit={updateItem}
            type={type}
          />
        )
      }}
    </Query>
  )
}

export default compose(
  withApollo,
  withListQuery,
  withItemQuery,
  withUpdateItemMutation,
  withHandlers({ updateItem })
)(Edit)
