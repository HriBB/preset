// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Query, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Trans, withI18n } from '@lingui/react'

import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'

import { getUpdateVariables, getUpdateUpdateHandler } from 'preset/utils'
import { withItemQuery, withListQuery } from 'preset/queries'
import { withUpdateItemMutation } from 'preset/mutations'

import { Header, Content, Error, Spinner } from 'components/ux'
import Form from 'components/Form'

const Update = props => {
  const { match, model, itemQuery, updateItem } = props
  const { id } = match.params
  return (
    <Fragment>
      <Header title={
        <Fragment>
          <Trans>Edit</Trans> <Trans id={model.single} />
        </Fragment>
      }>
        <IconButton component={Link} to={`/${model.name}`} color={'inherit'}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Content>
        <Query query={itemQuery} variables={{ id }}>
          {({ error, loading, data }) => {
            if (error) return <Error>{error.message}<br />{error.stack}</Error>
            if (loading) return <Spinner />
            if (!data.item) return <Error><Trans>Item {id} not found!</Trans></Error>
            return (
              <Fragment>
                <Form
                  button={<Trans>Save</Trans>}
                  form={`Edit${model.name}`}
                  initialValues={data.item}
                  onSubmit={updateItem}
                  model={model}
                />
              </Fragment>
            )
          }}
        </Query>
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
  withItemQuery,
  withListQuery,
  withUpdateItemMutation,
  withHandlers({
    updateItem: (props: any) => (data: any) =>
      props.client.mutate({
        mutation: props.updateMutation,
        variables: getUpdateVariables(props, data),
        update: getUpdateUpdateHandler(data.id, props),
      })
      .then(({ data }) => {
        props.snackbar.show(<Trans>Updated</Trans>)
      })
      .catch(error => {
        props.dialog.show(<Trans>Error</Trans>, error)
      }),
  }),
)(Update)
