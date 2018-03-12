// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'

import { hasQuery } from 'preset/utils'
import { withListQuery } from 'preset/queries'
import { withCreateItemMutation } from 'preset/mutations'

import Header from 'components/Header'
import Content from 'components/Content'
import Form from 'components/Form'

const Create = props => {
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
      <Header title={`Create ${model.single}`}>
        <IconButton component={Link} to={`/${model.name}`} color={'inherit'}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Content>
        <Form
          button={`Create`}
          form={`Create${model.name}`}
          initialValues={initialValues}
          onSubmit={createItem}
          model={model}
        />
      </Content>
    </Fragment>
  )
}

const getMutationVariables = ({ model }, data) => {
  return model.fields.reduce((obj, { name, type, list }) => {
    if (!data.hasOwnProperty(name)) {
      obj[name] = null
    } else if (type === 'File') {
      obj[name] = list ? data[name] : data[name][0]
    } else {
      obj[name] = data[name]
    }
    return obj
  }, {})
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
      const variables = getMutationVariables(props, data)
      const update = (proxy, { data: result }) => {
        const newItem = result[createMutationName]
        if (hasQuery(client, listQuery)) {
          const data = proxy.readQuery({ query: listQuery })
          data.items.push(newItem)
          proxy.writeQuery({ query: listQuery, data })
        }
      }
      return client
        .mutate({
          mutation: createMutation,
          variables,
          update,
        })
        .then(({ data }) => {
          console.log(data[createMutationName])
          props.snackbar.show('Created!')
        })
        .catch(error => {
          console.log(error)
        })
    },
  })
)(Create)
