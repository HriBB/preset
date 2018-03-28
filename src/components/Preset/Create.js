// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Trans, withI18n } from '@lingui/react'

import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import { Header, Content } from 'components/ux'

import Form from './Form'

import {
  getInitialValues,
  getCreateMutation,
  getCreateVariables,
  getCreateUpdateHandler,
} from './utils'

const PresetCreate = props => {
  const { model, createItem } = props
  const initialValues = getInitialValues(model)
  return (
    <Fragment>
      <Header
        title={
          <Fragment>
            <Trans>Create</Trans> <Trans id={`${model.name}_single`} />
          </Fragment>
        }
      >
        <IconButton component={Link} to={`/${model.name}`} color={'inherit'}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Content>
        <Form
          button={<Trans>Create</Trans>}
          form={`create${model.name}`}
          initialValues={initialValues}
          onSubmit={createItem}
          model={model}
        />
      </Content>
    </Fragment>
  )
}

export default compose(
  getContext({
    dialog: PropTypes.object,
    snackbar: PropTypes.object,
  }),
  withI18n(),
  withApollo,
  withRouter,
  withHandlers({
    createItem: (props) => (data) => {
      return props.client
        .mutate({
          mutation: getCreateMutation(props.model),
          update: getCreateUpdateHandler(props),
          variables: getCreateVariables(props, data),
        })
        .then(({ data }) => {
          props.snackbar.show(
            <Trans>{props.model.name} created</Trans>
          )
          props.history.push(
            `/${props.model.name}/${data[`create${props.model.name}`].id}`
          )
        })
        .catch(error => {
          props.dialog.show(<Trans>Error</Trans>, error)
        })
    },
  })
)(PresetCreate)
