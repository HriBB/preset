// @flow

import React, { Fragment } from 'react'
import { compose, withHandlers, withStateHandlers } from 'recompose'
import { withApollo } from 'react-apollo'

import { withListQuery } from 'preset/queries'
import { withCreateItemMutation } from 'preset/mutations'
import { createItem } from 'preset/handlers'

import { Snackbar } from 'components/ux'
import Form from 'components/Form'

const Create = (props) => {
  const { model, createItem } = props
  const initialValues = model.fields.reduce((values, field) => {
    if (field.default) {
      values[field.name] = field.default
    } else if (field.type === 'Checkbox') {
      values[field.name] = false
    }
    return values
  }, {})

  return (
    <Fragment>
      <Form
        button={`Create`}
        title={`Create ${model.name}`}
        form={`Create${model.name}`}
        initialValues={initialValues}
        onSubmit={createItem}
        model={model}
      />
      <Snackbar
        open={!!props.snackbar}
        onClose={props.hideSnackbar}
        message={props.snackbar || 'Saved!'}
      />
    </Fragment>
  )
}

export default compose(
  withApollo,
  withListQuery,
  withCreateItemMutation,
  withStateHandlers(
    ({ snackbar = false }) => ({ snackbar }),
    {
      showSnackbar: ({ snackbar }) => (text) => ({ snackbar: text }),
      hideSnackbar: ({ snackbar }) => () => ({ snackbar: false }),
    },
  ),
  withHandlers({ createItem }),
)(Create)
