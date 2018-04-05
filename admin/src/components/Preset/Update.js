// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Query, withApollo } from 'react-apollo'
import { Trans, withI18n } from '@lingui/react'

import {
  getItemQuery,
  getUpdateMutation,
  getUpdateVariables,
  getUpdateUpdateHandler,
} from './utils'

import {
  Body,
  Header,
  Content,
  Error,
  Spinner,
  LanguageSwitcher,
  UserIcon,
} from 'components/ux'

import Form from './Form'

const PresetUpdate = props => {
  const { match, model, updateItem } = props
  const { id } = match.params
  return (
    <Body>
      <Header
        title={
          <Fragment>
            <Trans>Edit</Trans> <Trans id={`${model.name}_single`} />
          </Fragment>
        }
      >
        <LanguageSwitcher />
        <UserIcon />
      </Header>
      <Query query={getItemQuery(model)} variables={{ id }}>
        {({ error, loading, data }) => {
          if (error) return <Error>{error.message}</Error>
          if (loading) return <Spinner />
          if (!data.item) return <Error><Trans>Item not found</Trans></Error>
          return (
            <Content>
              <Form
                button={<Trans>Save</Trans>}
                form={`edit${model.name}`}
                initialValues={data.item}
                onSubmit={updateItem}
                model={model}
              />
            </Content>
          )
        }}
      </Query>
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
  withHandlers({
    updateItem: (props) => (data) =>
      props.client
        .mutate({
          mutation: getUpdateMutation(props.model),
          update: getUpdateUpdateHandler(data.id, props),
          variables: getUpdateVariables(props, data),
        })
        .then(({ data }) => {
          props.snackbar.show(<Trans>Model updated</Trans>)
        })
        .catch(error => {
          props.dialog.show(<Trans>Error</Trans>, error.message)
        }),
  })
)(PresetUpdate)
