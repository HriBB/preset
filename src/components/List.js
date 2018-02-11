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
import AddIcon from 'material-ui-icons/Add'

import { getNameField } from 'preset/utils'
import { withListQuery } from 'preset/queries'
import { withDeleteItemMutation } from 'preset/mutations'
import { deleteItem } from 'preset/handlers'

const List = (props: any) => {
  const { classes, listQuery, model } = props
  return (
    <Query query={listQuery}>
      {({ error, loading, data }) => {
        if (error) return (<p>{error.message}</p>)
        if (loading) return (<p>Loading ...</p>)
        const field = getNameField(model)
        const { deleteItem } = props
        return (
          <Fragment>
            <CardHeader
              avatar={
                <Avatar aria-label={`${model.name} List`}>
                  {model.name.substring(0,1)}
                </Avatar>
              }
              action={
                <IconButton component={Link} to={`/${model.name}/create`}>
                  <AddIcon />
                </IconButton>
              }
              title={`${model.label} List`}
            />
            <MuiList className={classes.list} component={'ul'}>
              {data.items.map(item => 
                <ListItem key={item.id} button component={Link} to={`/${model.name}/${item.id}`}>
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
