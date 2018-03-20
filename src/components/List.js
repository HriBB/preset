// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Query, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import {
  default as MuiList,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'
import ImageIcon from 'material-ui-icons/Image'

import { getNameField, hasQuery } from 'preset/utils'
import { withListQuery } from 'preset/queries'
import { withDeleteItemMutation } from 'preset/mutations'

import { Header, Content, Error, Spinner } from 'components/ux'

const List = (props: any) => {
  const { classes, listQuery, model } = props
  return (
    <Fragment>
      <Header title={<Trans id={model.name} />}>
        <IconButton
          component={Link}
          to={`/${model.name}/create`}
          color={'inherit'}
        >
          <AddIcon />
        </IconButton>
        <IconButton component={Link} to={`/`} color={'inherit'}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Content>
        <Query query={listQuery}>
          {({ error, loading, data }) => (
            <Fragment>
              {error && <Error>{error.message}</Error>}
              {!error && loading && <Spinner />}
              {!error &&
                !loading &&
                data && (
                  <MuiList className={classes.list} component={'ul'}>
                    {data.items.map(item => (
                      <ListItem
                        key={item.id}
                        button
                        component={Link}
                        to={`/${model.name}/${item.id}`}
                      >
                        <Avatar
                          className={classes.avatar}
                          alt={item[getNameField(model)]}
                          src={item.image ? item.image.url : null}
                        >
                          {!item.image && <ImageIcon />}
                        </Avatar>
                        <ListItemText primary={item[getNameField(model)]} />
                        <ListItemSecondaryAction>
                          <IconButton
                            aria-label={<Trans>cms.delete</Trans>}
                            data-id={item.id}
                            onClick={props.deleteItem}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </MuiList>
                )}
            </Fragment>
          )}
        </Query>
      </Content>
    </Fragment>
  )
}

const styles = theme => ({
  header: {
    paddingRight: theme.spacing.unit * 2 + 4,
  },
  list: {
    //marginTop: theme.spacing.unit * 2,
  },
  avatar: {
    color: '#fff',
  },
  link: {
    color: 'inherit',
    fontSize: theme.typography.fontSize * 1.2,
    textDecoration: 'none',
    marginRight: theme.spacing.unit * 2,
  },
})

export default compose(
  getContext({
    dialog: PropTypes.object,
    snackbar: PropTypes.object,
  }),
  withStyles(styles),
  withApollo,
  withListQuery,
  withDeleteItemMutation,
  withHandlers({
    deleteItem: (props: any) => (e: any) => {
      const { id } = e.currentTarget.dataset
      const { client, listQuery, deleteMutation, deleteMutationName } = props
      const update = (proxy, { data: result }) => {
        const { id } = result[deleteMutationName]
        if (hasQuery(client, listQuery)) {
          const data = proxy.readQuery({ query: listQuery })
          data.items = data.items.filter(i => i.id !== id)
          proxy.writeQuery({ query: listQuery, data })
        }
      }
      return client
        .mutate({
          mutation: deleteMutation,
          variables: { id },
          update,
        })
        .then(({ data }) => {
          props.snackbar.show(<Trans>cms.model_deleted</Trans>)
        })
        .catch(error => {
          props.dialog.show(<Trans>cms.error</Trans>, error)
        })
    },
  })
)(List)
