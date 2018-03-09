// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'
import { compose, withHandlers, withStateHandlers, withContext } from 'recompose'
import { Link, NavLink, Route, Switch } from 'react-router-dom'
import { Query, withApollo } from 'react-apollo'
import classnames from 'classnames'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import Card from 'material-ui/Card'

import { appQuery } from 'preset/queries'

import { Error, Spinner, Snackbar } from 'components/ux'

import Dashboard from 'components/Dashboard'
import Login from 'components/Login'
import Model from 'components/Model'
import User from 'components/User'

const App = (props) => {
  return (
    <Query query={appQuery}>
      {({ error, loading, data }) => {

        if (error) return (<Error>{error.message}</Error>)
        if (loading) return (<Spinner />)

        const { classes, logout, location } = props
        const { user, models } = data

        if (!user) return (<Login />)

        const linkClass = classnames(classes.link, classes.linkUpSm)

        return (
          <Fragment>
            <AppBar className={classes.appbar} position={'static'} color={'primary'}>
              <Toolbar className={classes.toolbar}>
                <Link to={'/'} className={classnames(linkClass, {active:location.pathname === '/'})}>
                  {'Dashboard'}
                </Link>
                <Link to={'/user'} className={classnames(linkClass, {active:location.pathname === '/user'})}>
                  {'User'}
                </Link>
                {models.map(model =>
                  <NavLink key={model.name} to={`/${model.name}`} className={linkClass}>
                    {model.label}
                  </NavLink>
                )}
                <div style={{flex:'1 1 100%'}} />
                <Button className={classes.button} onClick={logout}>
                  {'Logout'}
                </Button>
              </Toolbar>
            </AppBar>
            <Card className={classnames(classes.content, classes.contentSmUp)}>
              <Switch>
                <Route exact path={'/'} render={(matchProps) =>
                  <Dashboard {...matchProps} user={user} />
                } />
                <Route path={'/user'} render={(matchProps) =>
                  <User {...matchProps} user={user} />
                } />
                <Route path={'/:model'} render={(matchProps) =>
                  <Model {...matchProps} user={user} />
                } />
              </Switch>
            </Card>
            <Snackbar
              open={!!props.snackbar}
              onClose={props.hideSnackbar}
              message={props.snackbar.text || 'Saved!'}
            />
          </Fragment>
        )
      }}
    </Query>
  )
}

const styles = (theme) => ({
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
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    flex: '1',
    padding: `0 ${theme.spacing.unit * 2}px`,
    maxWidth: '960px',
  },
  content: {
    maxWidth: '920px',
    minHeight: 'calc(100vh - 96px)',
    margin: `${theme.spacing.unit * 2}px`,
    padding: theme.spacing.unit * 2,
  },
  link: {
    height: '56px',
    lineHeight: '56px',
    marginRight: theme.spacing.unit * 2,
    fontSize: theme.typography.fontSize * 1.2,
    borderBottom: '4px solid transparent',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    color: 'inherit',
    '&.active': {
      borderBottom: '4px solid #fff',
    },
  },
  button: {
    color: 'inherit',
  },
  [theme.breakpoints.up('sm')]: {
    linkUpSm: {
      height: '64px',
      lineHeight: '64px',
    },
  },
  [theme.breakpoints.up('md')]: {
    contentSmUp: {
      margin: `${theme.spacing.unit * 2}px auto`,
    },
  }
})

const EnhancedApp = compose(
  withApollo,
  withStyles(styles),
  withHandlers({
    logout: ({ client }) => (e) => {
      localStorage.removeItem('token')
      client.resetStore()
    }
  }),
  withStateHandlers(
    ({ snackbar = false }) => ({ snackbar }),
    {
      showSnackbar: ({ snackbar }) => (text) => ({ snackbar: text }),
      hideSnackbar: ({ snackbar }) => () => ({ snackbar: false }),
    },
  ),
  withContext(
    { snackbar: PropTypes.object },
    (props) => ({ snackbar: {
      text: props.snackbar,
      show: props.showSnackbar,
      hide: props.hideSnackbar,
    } })
  ),
)(App)

export default hot(module)(EnhancedApp)