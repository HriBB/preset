// @flow

import React, { Fragment } from 'react'
import { hot } from 'react-hot-loader'
import { compose, withHandlers } from 'recompose'
import { Link, NavLink, Route, Switch } from 'react-router-dom'
import { Query, withApollo } from 'react-apollo'
import classnames from 'classnames'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import Card from 'material-ui/Card'

import Dashboard from 'components/Dashboard'
import Login from 'components/Login'
import Model from 'components/Model'

// ./containers/App.js

export default (App)

const query = gql`
  query AppQuery {
    user: viewer {
      id
      username
      email
    }
    models: models {
      name
      label
    }
  }
`

const App = (props) => {
  return (
    <Query query={query}>
      {({ error, loading, data }) => {

        if (error) return (<p>{error.message}</p>)
        if (loading) return (<p>Loading ...</p>)

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
                <Route path={'/login'} render={(matchProps) =>
                  <Login {...matchProps} user={user} />
                } />
                <Route path={'/:module'} render={(matchProps) =>
                  <Model {...matchProps} user={user} />
                } />
              </Switch>
            </Card>
          </Fragment>
        )
      }}
    </Query>
  )
}

const styleSheet = (theme) => ({
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
  withStyles(styleSheet),
  withHandlers({
    logout: ({ client }) => (e) => {
      localStorage.removeItem('token')
      client.resetStore()
    }
  }),
)(App)

export default hot(module)(EnhancedApp)