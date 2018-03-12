// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Query, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'
import {
  default as MuiList,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import DeleteIcon from 'material-ui-icons/Delete'
import AddIcon from 'material-ui-icons/Add'

import { getNameField, hasQuery } from 'preset/utils'
import { withListQuery } from 'preset/queries'
import { withDeleteItemMutation } from 'preset/mutations'

import { Error, Spinner } from 'components/ux'

import Header from 'components/Header'
import Content from 'components/Content'

const List = (props: any) => {
  const { classes, listQuery, model } = props
  return (
    <Fragment>
      <Header title={model.label}>
        <IconButton component={Link} to={`/${model.name}/create`} color={'inherit'}>
          <AddIcon />
        </IconButton>
        <IconButton component={Link} to={`/`} color={'inherit'}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Content>
        <Query query={listQuery}>
          {({ error, loading, data }) => {
            return (
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
                          <ListItemText primary={item[getNameField(model)]} />
                          <ListItemSecondaryAction>
                            <IconButton
                              aria-label={'Delete'}
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
            )
          }}
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
  link: {
    color: 'inherit',
    fontSize: theme.typography.fontSize * 1.2,
    textDecoration: 'none',
    marginRight: theme.spacing.unit * 2,
  },
})

export default compose(
  getContext({ snackbar: PropTypes.object }),
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
          console.log(data[deleteMutationName])
          props.snackbar.show('Deleted!')
        })
        .catch(error => {
          console.log(error)
        })
    },
  })
)(List)
