// @flow

import React, { Fragment } from 'react'
import { compose, withHandlers, withStateHandlers } from 'recompose'
import { Query, withApollo } from 'react-apollo'

import { withItemQuery, withListQuery } from 'preset/queries'
import { withUpdateItemMutation } from 'preset/mutations'
import { updateItem } from 'preset/handlers'

import { Error, Spinner, Snackbar } from 'components/ux'
import Form from 'components/Form'

const Edit = (props) => {
  const { match, model, itemQuery, updateItem } = props
  const { id } = match.params
  return (
    <Query query={itemQuery} variables={{ id }}>
      {({ error, loading, data }) => {
        if (error) return (<Error>{error.message}<br />{error.stack}</Error>)
        if (loading) return (<Spinner />)
        const { item } = data
        if (!item) return (<Error>{`Item ${id} not found!`}</Error>)
        return (
          <Fragment>
            <Form
              button={`Save`}
              title={`Edit ${model.name}`}
              form={`Edit${model.name}`}
              initialValues={item}
              onSubmit={updateItem}
              model={model}
            />
            <Snackbar
              open={!!props.snackbar}
              onClose={props.hideSnackbar}
              message={props.snackbar || 'Saved!'}
            />
          </Fragment>
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
  withStateHandlers(
    ({ snackbar = false }) => ({ snackbar }),
    {
      showSnackbar: ({ snackbar }) => (text) => ({ snackbar: text }),
      hideSnackbar: ({ snackbar }) => () => ({ snackbar: false }),
    },
  ),
  withHandlers({ updateItem }),
)(Edit)
