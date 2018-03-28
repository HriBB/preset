// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Query, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'
import ImageIcon from 'material-ui-icons/Image'
import { Header, Content, Error, Spinner } from 'components/ux'

import {
  getNameField,
  getListQuery,
  getDeleteMutation,
  getDeleteUpdateHandler,
} from './utils'

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

const PresetList = (props: any) => {
  const { classes, model } = props
  return (
    <Fragment>
      <Header title={<Trans id={`${model.name}_single`} />}>
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
        <Query query={getListQuery(model)}>
          {({ error, loading, data }) => {
            if (error) {
              return <Error>{error.message}</Error>
            }
            if (loading) {
              return <Spinner />
            }
            return (
              <List>
                {data.items.map(item => (
                  <ListItem
                    key={item.id}
                    button
                    component={Link}
                    to={`/${model.name}/${item.id}`}
                  >
                    <Avatar
                      className={classes.avatar}
                      src={item.image && item.image.url}
                    >
                      {!item.image && <ImageIcon />}
                    </Avatar>
                    <ListItemText primary={item[getNameField(model)]} />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label={<Trans>Delete</Trans>}
                        data-id={item.id}
                        onClick={props.deleteItem}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
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
  withStyles(styles),
  withApollo,
  withHandlers({
    deleteItem: (props) => (e) => {
      const { id } = e.currentTarget.dataset
      return props.client
        .mutate({
          mutation: getDeleteMutation(props.model),
          update: getDeleteUpdateHandler(id, props),
          variables: { id },
        })
        .then(({ data }) => {
          props.snackbar.show(<Trans>Model deleted</Trans>)
        })
        .catch(error => {
          props.dialog.show(<Trans>Error</Trans>, error)
        })
    },
  })
)(PresetList)
