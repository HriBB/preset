// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Query, withApollo } from 'react-apollo'

import { hasQuery } from 'preset/utils'
import { withItemQuery, withListQuery } from 'preset/queries'
import { withUpdateItemMutation } from 'preset/mutations'

import { Error, Spinner } from 'components/ux'
import Form from 'components/Form'

const Update = props => {
  const { match, model, itemQuery, updateItem } = props
  const { id } = match.params
  return (
    <Query query={itemQuery} variables={{ id }}>
      {({ error, loading, data }) => {
        if (error)
          return (
            <Error>
              {error.message}
              <br />
              {error.stack}
            </Error>
          )
        if (loading) return <Spinner />
        const { item } = data
        if (!item) return <Error>{`Item ${id} not found!`}</Error>
        return (
          <Fragment>
            <Form
              button={`Save`}
              title={`Edit ${model.label}`}
              form={`Edit${model.name}`}
              initialValues={item}
              onSubmit={updateItem}
              model={model}
            />
          </Fragment>
        )
      }}
    </Query>
  )
}

export default compose(
  getContext({ snackbar: PropTypes.object }),
  withApollo,
  withItemQuery,
  withListQuery,
  withUpdateItemMutation,
  withHandlers({
    updateItem: (props: any) => (data: any) => {
      const { client, listQuery, updateMutation, updateMutationName } = props
      const { __typename, ...variables } = data
      const update = (proxy, { data: result }) => {
        const newItem = result[updateMutationName]
        if (hasQuery(client, listQuery)) {
          const { id } = variables
          const data = proxy.readQuery({ query: listQuery })
          const index = data.items.findIndex(i => i.id === id)
          data.items[index] = newItem
          proxy.writeQuery({ query: listQuery, data })
        }
      }
      return client
        .mutate({
          mutation: updateMutation,
          variables,
          update,
        })
        .then(({ data }) => {
          console.log(data[updateMutationName])
          props.snackbar.show('Updated!')
        })
        .catch(error => {
          console.log(error)
        })
    },
  })
)(Update)
