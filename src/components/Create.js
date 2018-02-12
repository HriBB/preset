// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router'

import { hasQuery } from 'preset/utils'
import { withListQuery } from 'preset/queries'
import { withCreateItemMutation } from 'preset/mutations'

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
        title={`Create ${model.label}`}
        form={`Create${model.name}`}
        initialValues={initialValues}
        onSubmit={createItem}
        model={model}
      />
    </Fragment>
  )
}

export default compose(
  getContext({ snackbar: PropTypes.object }),
  withApollo,
  withRouter,
  withListQuery,
  withCreateItemMutation,
  withHandlers({
    createItem: (props: any) => (data: any) => {
      const { client, listQuery, createMutation, createMutationName } = props
      return client.mutate({
        mutation: createMutation,
        variables: data,
        update: (proxy, { data: result }) => {
          const newItem = result[createMutationName]
          if (hasQuery(client, listQuery)) {
            const data = proxy.readQuery({ query: listQuery })
            data.items.push(newItem)
            proxy.writeQuery({ query: listQuery, data })
          }
        },
      })
      .then(({ data }) => {
        console.log(data[createMutationName])
        props.snackbar.show('Created!')
      })
      .catch(error => {
        console.log(error)
      })
    }
  }),
)(Create)
