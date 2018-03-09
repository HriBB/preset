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
import { Link, NavLink, Route, Switch } from 'react-router-dom'
import { Query, withApollo } from 'react-apollo'
import classnames from 'classnames'

import { withStyles } from 'material-ui/styles'
import withWidth, { isWidthUp } from 'material-ui/utils/withWidth'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import Card from 'material-ui/Card'
import Drawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
} from 'material-ui/List'
import MenuIcon from 'material-ui-icons/Menu'
import InboxIcon from 'material-ui-icons/Inbox'

import { appQuery } from 'preset/queries'

import { Error, Spinner, Snackbar } from 'components/ux'

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

        const { user, models } = data
        const { classes, logout, drawer, width, theme } = props

        const isWidthUpSm = isWidthUp(theme.drawer.breakpoint, width)
        const drawerVariant = isWidthUpSm ? 'permanent' : 'temporary'

        return (
          <Fragment>

            <AppBar className={classes.appbar} position={'static'} color={'primary'}>
              <Toolbar className={classes.toolbar}>
                <IconButton className={classes.menuButton} color={'inherit'} aria-label={'Menu'} onClick={props.toggleDrawer}>
                  <MenuIcon />
                </IconButton>
                <Link to={'/'} className={classes.title}>
                  {'Dashboard'}
                </Link>
                {/*<div style={{ flex: '1 1 100%' }} />*/}
                <Button className={classes.button} onClick={logout}>
                  {'Logout'}
                </Button>
              </Toolbar>
            </AppBar>

            <Drawer
              className={classes.drawer}
              classes={{
                paper: classes.drawerPaper,
              }}
              open={isWidthUpSm || drawer}
              variant={drawerVariant}
              onClose={props.toggleDrawer}
            >
              <Toolbar className={classes.drawerToolbar}>
                <Link to={'/'} className={classes.drawerTitle}>
                  {'Preset CMS'}
                </Link>
              </Toolbar>
              <List className={classes.drawerList} component={'nav'}>
                {models.map(model => (
                  <ListItem
                    className={classes.drawerListItem}
                    key={model.name}
                    component={NavLink}
                    to={`/${model.name}`}
                    onClick={props.toggleDrawer}
                    button
                    >
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={model.label} />
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List className={classes.drawerList} component={'nav'}>
                <ListItem
                  className={classes.drawerListItem}
                  component={Link}
                  to={'/user'}
                  onClick={props.toggleDrawer}
                  button
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={'User'} />
                </ListItem>
              </List>
            </Drawer>

            <Card className={classnames(classes.content, classes.contentSmUp)}>
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
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    [theme.breakpoints.up(theme.drawer.breakpoint)]: {
      paddingLeft: 250,
    },
  },
  toolbar: {
    flex: '1',
    padding: `0 ${theme.spacing.unit * 2}px 0`,
    maxWidth: '960px',
  },
  menuButton: {
    [theme.breakpoints.up(theme.drawer.breakpoint)]: {
      display: 'none',
    },
  },
  title: {
    ...theme.typography.title,
    color: '#fff',
    flex: '1 1 100%',
    marginLeft: theme.spacing.unit * 2,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  button: {
    color: 'inherit',
  },

  drawer: {
    width: '250px',
  },
  drawerPaper: {
    width: '250px',
  },
  drawerTitle: {
    ...theme.typography.title,
    color: '#000',
    textDecoration: 'none',
  },
  drawerToolbar: {
    padding: `0 ${theme.spacing.unit * 3}px`,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  drawerList: {
    flex: '0 1 auto',
  },
  drawerListItem: {
    paddingLeft: theme.spacing.unit * 3,
    '& svg': {
      marginRight: 0,
    },
  },

  content: {
    maxWidth: '920px',
    minHeight: 'calc(100vh - 96px)',
    margin: `${theme.spacing.unit * 2}px`,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(theme.drawer.breakpoint)]: {
      marginLeft: 250 + (theme.spacing.unit * 2),
    },
  },
})

const EnhancedApp = compose(
  withApollo,
  withWidth({ withTheme: true }),
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
  withContext({ snackbar: PropTypes.object }, props => ({
    snackbar: {
      text: props.snackbar,
      show: props.showSnackbar,
      hide: props.hideSnackbar,
    },
  }))
)(App)

export default hot(module)(EnhancedApp)
