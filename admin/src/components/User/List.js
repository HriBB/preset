// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import AddIcon from 'material-ui-icons/Add'
import DeleteIcon from 'material-ui-icons/Delete'
import ImageIcon from 'material-ui-icons/Image'
import {
  Body,
  Header,
  Content,
  Error,
  Spinner,
  IconLink,
  LanguageSwitcher,
  UserIcon,
} from 'components/ux'

import query from './List.graphql'

const UserList = ({ classes, ...props }) => {
  return (
    <Body>
      <Header title={<Trans>User List</Trans>}>
        <IconLink to={'/user/create'}>
          <AddIcon />
        </IconLink>
        <LanguageSwitcher />
        <UserIcon />
      </Header>
      <Content>
        <Query query={query}>
          {({ error, loading, data }) => {
            if (error) return <Error>{error.message}</Error>
            if (loading) return <Spinner />
            return (
              <List>
                {data.users.map(user =>
                  <ListItem
                    key={user.id}
                    button
                    component={Link}
                    to={`/user/edit/${user.id}`}
                  >
                    <Avatar
                      className={classes.avatar}
                      src={user.image && user.image.url}
                    >
                      {!user.image && <ImageIcon />}
                    </Avatar>
                    <ListItemText
                      primary={user.username}
                      secondary={user.email}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label={<Trans>Delete</Trans>}
                        data-id={user.id}
                        onClick={props.deleteItem}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )}
              </List>
            )
          }}
        </Query>
      </Content>
    </Body>
  )
}

const styles = theme => ({
  table: {
    border: '1px solid red',
    display: 'block',
    width: '100%',
    overflowX: 'auto',
  },
})

export default compose(
  getContext({
    viewer: PropTypes.object,
    snackbar: PropTypes.object,
  }),
  withStyles(styles),
  withHandlers({
    test: () => () => {
      console.log('test123')
    },
  }),
)(UserList)
