// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Trans } from '@lingui/react'

import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'

import {
  getCreateVariables,
  getCreateUpdateHandler,
  getModelInitialValues,
} from 'preset/utils'
import { withListQuery } from 'preset/queries'
import { withCreateItemMutation } from 'preset/mutations'

import { Header, Content } from 'components/ux'
import Form from 'components/Form'

const Create = props => {
  const { model, createItem } = props
  const initialValues = getModelInitialValues(model)
  return (
    <Fragment>
      <Header title={
        <Fragment>
          <Trans>Create</Trans> <Trans id={model.single} />
        </Fragment>
      }>
        <IconButton component={Link} to={`/${model.name}`} color={'inherit'}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Content>
        <Form
          button={<Trans>Create</Trans>}
          form={`Create${model.name}`}
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
  withApollo,
  withRouter,
  withListQuery,
  withCreateItemMutation,
  withHandlers({
    createItem: (props: any) => (data: any) =>
      props.client.mutate({
        mutation: props.createMutation,
        variables: getCreateVariables(props, data),
        update: getCreateUpdateHandler(props),
      })
      .then(({ data }) => {
        props.snackbar.show(<Trans>{props.model.single} created</Trans>)
        props.history.push(`/${props.model.name}/${data[props.createMutationName].id}`)
      })
      .catch(error => {
        props.dialog.show('Error', error)
      }),
  }),
)(Create)
