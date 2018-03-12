// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'
import {
  compose,
  withHandlers,
  withStateHandlers,
  withContext,
} from 'recompose'
import { Route, Switch } from 'react-router-dom'
import { Query, withApollo } from 'react-apollo'

import { withStyles } from 'material-ui/styles'

import { appQuery } from 'preset/queries'

import { Error, Spinner, Snackbar } from 'components/ux'

import Drawer from 'components/Drawer'
import Dashboard from 'components/Dashboard'
import Login from 'components/Login'
import Model from 'components/Model'
import User from 'components/User'

const App = props => {
  return (
    <Query query={appQuery}>
      {({ error, loading, data }) => {
        if (error) return <Error>{error.message}</Error>
        if (loading) return <Spinner />
        if (!data.user) return <Login />

        const { classes, drawer } = props
        const { user, models } = data
        return (
          <Fragment>

            <Drawer open={drawer} models={models} />

            <div className={classes.content}>
              <Switch>
                <Route
                  exact
                  path={'/'}
                  render={matchProps => (
                    <Dashboard {...matchProps} user={user} />
                  )}
                />
                <Route
                  path={'/user'}
                  render={matchProps => <User {...matchProps} user={user} />}
                />
                <Route
                  path={'/:model'}
                  render={matchProps => <Model {...matchProps} user={user} />}
                />
              </Switch>
            </div>

            <Snackbar
              open={!!props.snackbar}
              onClose={props.hideSnackbar}
              message={props.snackbar || 'Saved!'}
            />

          </Fragment>
        )
      }}
    </Query>
  )
}

const styles = theme => ({
  '@global': {
    html: {
      boxSizing: 'border-box',
    },
    '*, *:before, *:after': {
      boxSizing: 'inherit',
    },
    body: {
      margin: 0,
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      lineHeight: '1.2',
      overflowX: 'hidden',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    img: {
      width: 'auto',
      height: 'auto',
      maxWidth: '100%',
    },
    '#root': {
      display: 'flex',
      width: '100%',
    },
  },
  content: {
    flex: '1',
  },
})

const EnhancedApp = compose(
  withApollo,
  withStyles(styles),
  withHandlers({
    logout: ({ client }) => e => {
      localStorage.removeItem('token')
      client.resetStore()
    },
  }),
  withStateHandlers(
    ({ drawer = false, snackbar = false }) => ({ drawer, snackbar }),
    {
      toggleDrawer: ({ drawer }) => () => ({ drawer: !drawer }),
      openDrawer: () => () => ({ drawer: true }),
      closeDrawer: () => () => ({ drawer: false }),
      showSnackbar: ({ snackbar }) => text => ({ snackbar: text }),
      hideSnackbar: ({ snackbar }) => () => ({ snackbar: false }),
    }
  ),
  withContext({
    user: PropTypes.object,
    drawer: PropTypes.object,
    snackbar: PropTypes.object,
  }, props => ({
    user: {
      logout: props.logout,
    },
    drawer: {
      toggle: props.toggleDrawer,
      open: props.openDrawer,
      close: props.closeDrawer,
    },
    snackbar: {
      text: props.snackbar,
      show: props.showSnackbar,
      hide: props.hideSnackbar,
    },
  }))
)(App)

export default hot(module)(EnhancedApp)
