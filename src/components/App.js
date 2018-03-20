// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'
import { compose, withHandlers, withStateHandlers, withContext } from 'recompose'
import { Route, Switch } from 'react-router-dom'
import { Query, withApollo } from 'react-apollo'
import { withStyles } from 'material-ui/styles'
import { I18nProvider } from '@lingui/react'
import { Trans } from '@lingui/react'

import en from 'locale/si/messages'
import si from 'locale/si/messages'

import { appQuery } from 'preset/queries'

import { Dialog, Error, Spinner, Snackbar } from 'components/ux'
import Drawer from 'components/Drawer'
import Dashboard from 'components/Dashboard'
import Login from 'components/Login'
import Model from 'components/Model'
import Translations from 'components/Translations'
import User from 'components/User'

const App = props => {
  return (
    <I18nProvider language={'si'} catalogs={{ en, si }}>
      <Query query={appQuery}>
        {({ error, loading, data }) => {
          if (error) return <Error>{error.message}</Error>
          if (loading) return <Spinner />
          if (!data.user) return <Login />
          const { drawer } = props
          const { user, models } = data
          return (
            <Fragment>
              <Drawer open={drawer} models={models} />
              <Snackbar
                open={!!props.snackbar}
                onClose={props.hideSnackbar}
                message={props.snackbar || <Trans>cms.done</Trans>}
              />
              <Dialog
                open={props.dialog.open}
                onClose={props.hideDialog}
                title={props.dialog.title}
                content={props.dialog.content}
              />
              <Switch>
                <Route
                  exact
                  path={'/'}
                  render={matchProps => (
                    <Dashboard {...matchProps} models={models} user={user} />
                  )}
                />
                <Route
                  path={'/user'}
                  render={matchProps => <User {...matchProps} user={user} />}
                />
                <Route
                  path={'/translations/:namespace?'}
                  render={matchProps => <Translations {...matchProps} user={user} />}
                />
                <Route
                  path={'/:model'}
                  render={matchProps => <Model {...matchProps} user={user} />}
                />
              </Switch>
            </Fragment>
          )
        }}
      </Query>
    </I18nProvider>
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
})

const EnhancedApp = compose(
  withApollo,
  withStyles(styles),
  withStateHandlers(
    ({
      drawer = false,
      snackbar = false,
      dialog = { open: false, title: null, content: null },
    }) => ({
      drawer,
      snackbar,
      dialog,
    }),
    {
      toggleDrawer: ({ drawer }) => () => ({ drawer: !drawer }),
      openDrawer: () => () => ({ drawer: true }),
      closeDrawer: () => () => ({ drawer: false }),
      showSnackbar: () => text => ({ snackbar: text }),
      hideSnackbar: () => () => ({ snackbar: false }),
      showDialog: () => (title, content) => ({
        dialog: { open: true, title, content },
      }),
      hideDialog: () => () => ({
        dialog: { open: false, title: null, content: null },
      }),
    }
  ),
  withHandlers({
    logout: ({ client }) => e => {
      localStorage.removeItem('token')
      client.resetStore()
    },
  }),
  withContext(
    {
      user: PropTypes.object,
      drawer: PropTypes.object,
      snackbar: PropTypes.object,
      dialog: PropTypes.object,
    },
    props => ({
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
      dialog: {
        show: props.showDialog,
        hide: props.hideDialog,
      },
    })
  )
)(App)

export default hot(module)(EnhancedApp)
