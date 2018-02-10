// @flow

import React from 'react'
import { compose, withHandlers } from 'recompose'
import { Query, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import DeleteIcon from 'material-ui-icons/Delete'
import IconButton from 'material-ui/IconButton'
import {
  default as MuiList,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'

import { getTypeNameField, getTypeQueryFields } from './utils'

const List = (props: any) => {
  const { type } = props
  const query = gql`
    query ${type.name}ListQuery {
      items: ${type.name.toLowerCase()}s {
        ${getTypeQueryFields(type)}
      }
    }
  `
  return (
    <Query query={query}>
      {({ error, loading, data }) => {
        if (error) return (<p>{error.message}</p>)
        if (loading) return (<p>Loading ...</p>)
        const field = getTypeNameField(type)
        const { deleteItem } = props
        return (
          <MuiList component={'ul'}> 
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
        )
      }}
    </Query>
  )
}

const styleSheet = (theme) => ({
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
  withHandlers({
    deleteItem: (props) => (e) => {
      const { id } = e.currentTarget.dataset
      const { type, client } = props
      const mutation = gql`
        mutation delete${type.name}Mutation($id: ID!) {
          delete${type.name}(id: $id) {
            id
          }
        }
      `
      client.mutate({ mutation, variables: { id } })
        .then(result => {
          console.log(result)
        })
        .catch(error => {
          console.log(error)
        })

    },
  }),
)(List)
