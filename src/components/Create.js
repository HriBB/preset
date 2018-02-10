// @flow

import React from 'react'
import { compose, withHandlers } from 'recompose'
import { withApollo } from 'react-apollo'

import {
  getTypeFormFields,
  withListQuery,
  withCreateItemMutation,
  createItem,
} from './utils'

import Form from './Form'

const Create = (props) => {
  const { type, createItem } = props
  const fields = getTypeFormFields(type)
  const initialValues = fields.reduce((obj, val) => {
    if (val.default) obj[val.name] = val.default
    return obj
  }, {})
  return (
    <Form
      button={`Create`}
      title={`Create ${type.name}`}
      form={`Create${type.name}`}
      initialValues={initialValues}
      onSubmit={createItem}
      type={type}
    />
  )
}

export default compose(
  withApollo,
  withListQuery,
  withCreateItemMutation,
  withHandlers({ createItem }),
)(Create)
