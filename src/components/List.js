// @flow

import React, { Fragment } from 'react'
import { compose, withHandlers } from 'recompose'
import { Query, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'
import {
  default as MuiList,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import { CardHeader } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add';

import {
  getTypeNameField,
  withListQuery,
  withDeleteItemMutation,
  deleteItem,
} from './utils'

const List = (props: any) => {
  const { classes, listQuery, type } = props
  return (
    <Query query={listQuery}>
      {({ error, loading, data }) => {
        if (error) return (<p>{error.message}</p>)
        if (loading) return (<p>Loading ...</p>)
        const field = getTypeNameField(type)
        const { deleteItem } = props
        return (
          <Fragment>
            <CardHeader
              avatar={
                <Avatar aria-label={`${type.name} List`}>
                  {type.name.substring(0,1)}
                </Avatar>
              }
              action={
                <IconButton component={Link} to={`/${type.name}/create`}>
                  <AddIcon />
                </IconButton>
              }
              title={`${type.name} List`}
            />
            <MuiList className={classes.list} component={'ul'}>
              {data.items.map(item => 
                <ListItem key={item.id} button component={Link} to={`/${type.name}/${item.id}`}>
                  <ListItemText primary={item[field]} />
                  <ListItemSecondaryAction>
                    <IconButton aria-label={'Delete'} data-id={item.id} onClick={deleteItem}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )}
            </MuiList>
          </Fragment>
        )
      }}
    </Query>
  )
}

const styleSheet = (theme) => ({
  list: {
    //marginTop: theme.spacing.unit * 2,
  },
  link: {
    color: 'inherit',
    fontSize: theme.typography.fontSize * 1.2,
    textDecoration: 'none',
    marginRight: theme.spacing.unit * 2,
  },
})

export default compose(
  withStyles(styleSheet),
  withApollo,
  withListQuery,
  withDeleteItemMutation,
  withHandlers({ deleteItem }),
)(List)
