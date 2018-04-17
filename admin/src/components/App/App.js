// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux'
import { compose, withHandlers, withStateHandlers, withContext } from 'recompose'
import { withApollo } from 'react-apollo'
import { query } from 'react-apollo/query-hoc'
import { Route, Switch } from 'react-router-dom'
import { I18nProvider, Trans } from '@lingui/react'

import withWidth, { isWidthUp } from 'material-ui/utils/withWidth'
import { withStyles } from 'material-ui/styles'

import { Dialog, Snackbar, ErrorView, LoadingView, NotFoundView } from 'components/ux'
import { Dashboard } from 'components/Dashboard'
import { Preset } from 'components/Preset'
import { Translations } from 'components/Translations'
import { User } from 'components/User'
import { Pages } from 'components/Pages'
import { Login } from 'components/Login'

import Drawer from './Drawer'

import si from 'locale/si/messages'
import en from 'locale/en/messages'

import appQuery from './App.graphql'

const App = (props) => {
  const { data: { error, loading, viewer }, theme, width } = props
  const drawerDocked = isWidthUp(theme.drawer.breakpoint, width)
  return (
    <I18nProvider language={props.language} catalogs={{ en, si }}>
      {viewer && 
        <Drawer
          language={props.language}
          page={props.match.params.page}
          open={drawerDocked || props.drawer}
          variant={drawerDocked ? 'permanent' : 'temporary'}
        />
      }
      <Snackbar
        open={!!props.snackbar}
        onClose={props.hideSnackbar}
        message={props.snackbar || <Trans>Done</Trans>}
      />
      <Dialog
        open={props.dialog.open}
        onClose={props.hideDialog}
        title={props.dialog.title}
        content={props.dialog.content}
      />
      {error && 
        <ErrorView error={error} />
      }
      {!error && loading &&
        <LoadingView />
      }
      {!error && !loading && !viewer &&
        <Login />
      }
      {!error && !loading && viewer &&
        <Switch>
          <Route exact path={'/'} component={Dashboard} />
          <Route path={'/user'} component={User} />
          <Route path={'/pages'} component={Pages} />
          <Route path={'/translations/:ns?'} component={Translations} />
          <Route path={'/model/:model'} component={Preset} />
          <Route component={NotFoundView} />
        </Switch>
      }
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
  withWidth({ withTheme: true }),
  query(appQuery),
  connect(
    (state, props) => ({
      language: state.app.language,
    }),
  ),
  withHandlers({
    logout: ({ client }) => e => {
      localStorage.removeItem('token')
      client.resetStore()
    },
  }),
  // TODO: put in redux
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
  withContext(
    {
      viewer: PropTypes.object,
      drawer: PropTypes.object,
      snackbar: PropTypes.object,
      dialog: PropTypes.object,
    },
    props => ({
      viewer: {
        ...props.data.viewer,
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
