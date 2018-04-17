// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Query, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'
import ImageIcon from 'material-ui-icons/Image'

import {
  Body,
  Content,
  Error,
  Header,
  IconLink,
  LanguageSwitcher,
  Spinner,
  UserIcon,
} from 'components/ux'

import deletePageMutation from './mutations/deletePage.graphql'
import deletePageUpdate from './mutations/deletePageUpdate'
import pagesQuery from './queries/pages.graphql'

const PresetList = (props: any) => {
  const { classes } = props
  return (
    <Body>
      <Header title={<Trans>Page List</Trans>}>
        <IconLink to={`/pages/create`}>
          <AddIcon />
        </IconLink>
        <LanguageSwitcher />
        <UserIcon />
      </Header>
      <Content>
        <Query query={pagesQuery}>
          {({ error, loading, data }) => {
            if (error) return <Error>{error.message}</Error>
            if (loading) return <Spinner />
            return (
              <List>
                {data.pages.map(page => (
                  <ListItem
                    key={page.id}
                    button
                    component={Link}
                    to={`/pages/${page.id}`}
                  >
                    <Avatar
                      className={classes.avatar}
                      src={page.image && page.image.url}
                    >
                      {!page.image && <ImageIcon />}
                    </Avatar>
                    <ListItemText primary={page.title} />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label={<Trans>Delete</Trans>}
                        data-id={page.id}
                        onClick={props.deletePage}
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
    </Body>
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
  withHandlers({
    deletePage: ({ client, dialog, snackbar }) => (e) => {
      const { id } = e.currentTarget.dataset
      return client
        .mutate({
          mutation: deletePageMutation,
          update: deletePageUpdate(client),
          variables: { id },
        })
        .then(({ data }) => {
          snackbar.show(<Trans>Page deleted</Trans>)
        })
        .catch(error => {
          dialog.show(<Trans>Error</Trans>, error.message)
        })
    },
  })
)(PresetList)
