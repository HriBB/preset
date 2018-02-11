// @flow

import React from 'react'
import { compose, withHandlers } from 'recompose'
import { withApollo } from 'react-apollo'

import { getFormFields } from 'preset/utils'
import { withListQuery } from 'preset/queries'
import { withCreateItemMutation } from 'preset/mutations'
import { createItem } from 'preset/handlers'

import Form from './Form'

const Create = (props) => {
  const { model, createItem } = props
  const fields = getFormFields(model)
  const initialValues = fields.reduce((obj, val) => {
    if (val.default) obj[val.name] = val.default
    return obj
  }, {})

  return (
    <Form
      button={`Create`}
      title={`Create ${model.name}`}
      form={`Create${model.name}`}
      initialValues={initialValues}
      onSubmit={createItem}
      model={model}
    />
  )
}

export default compose(
  withApollo,
  withListQuery,
  withCreateItemMutation,
  withHandlers({ createItem }),
)(Create)
