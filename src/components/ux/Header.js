// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { compose, getContext } from 'recompose'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'

const Header = props => {
  const { children, classes, drawer, title, titleLink } = props
  return (
    <AppBar className={classes.appbar} position={'sticky'} color={'primary'}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          className={classes.menuButton}
          color={'inherit'}
          aria-label={<Trans>cms.menu</Trans>}
          onClick={drawer.toggle}
        >
          <MenuIcon />
        </IconButton>
        <Link to={titleLink || '/'} className={classes.title}>
          {title}
        </Link>
        <div style={{ flex: '1' }} />
        {children}
      </Toolbar>
    </AppBar>
  )
}

const styles = theme => ({
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  toolbar: {
    flex: '1',
    padding: `0 ${theme.spacing.unit * 2}px 0`,
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
})

export default compose(
  getContext({ drawer: PropTypes.object }),
  withStyles(styles)
)(Header)
