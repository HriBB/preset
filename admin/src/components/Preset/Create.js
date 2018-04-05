// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router'
import { Trans, withI18n } from '@lingui/react'

import {
  Body,
  Header,
  Content,
  LanguageSwitcher,
  UserIcon,
} from 'components/ux'

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
    <Body>
      <Header
        title={
          <Fragment>
            <Trans>Create</Trans> <Trans id={`${model.name}_single`} />
          </Fragment>
        }
      >
        <LanguageSwitcher />
        <UserIcon />
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
    </Body>
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
            `/model/${props.model.name}/${data[`create${props.model.name}`].id}`
          )
        })
        .catch(error => {
          props.dialog.show(<Trans>Error</Trans>, error.message)
        })
    },
  })
)(PresetCreate)
