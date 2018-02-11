// @flow

import React from 'react'
import { compose, withHandlers } from 'recompose'
import { Query, withApollo } from 'react-apollo'

import { withItemQuery, withListQuery } from 'preset/queries'
import { withUpdateItemMutation } from 'preset/mutations'
import { updateItem } from 'preset/handlers'

import Form from './Form'

const Edit = (props) => {
  const { match, model, itemQuery, updateItem } = props
  console.log(itemQuery)
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
            title={`Edit ${model.name}`}
            form={`Edit${model.name}`}
            initialValues={item}
            onSubmit={updateItem}
            model={model}
          />
        )
      }}
    </Query>
  )
}

export default compose(
  withApollo,
  withItemQuery,
  withListQuery,
  withUpdateItemMutation,
  withHandlers({ updateItem })
)(Edit)
