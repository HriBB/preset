// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Query, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Trans, withI18n } from '@lingui/react'

import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import { Header, Content, Error, Spinner } from 'components/ux'

import Form from './Form'

import {
  getItemQuery,
  getUpdateMutation,
  getUpdateVariables,
  getUpdateUpdateHandler,
} from './utils'

const PresetUpdate = props => {
  const { match, model, updateItem } = props
  const { id } = match.params
  return (
    <Fragment>
      <Header
        title={
          <Fragment>
            <Trans>Edit</Trans> <Trans id={`${model.name}_single`} />
          </Fragment>
        }
      >
        <IconButton component={Link} to={`/${model.name}`} color={'inherit'}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Query query={getItemQuery(model)} variables={{ id }}>
        {({ error, loading, data }) => {
          if (error) {
            return (
              <Error>
                {error.message}
                <br />
                {error.stack}
              </Error>
            )
          }
          if (loading) {
            return <Spinner />
          }
          if (!data.item) {
            return (
              <Error>
                <Trans>Item not found</Trans>
              </Error>
            )
          }
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
          props.dialog.show(<Trans>Error</Trans>, error)
        }),
  })
)(PresetUpdate)
