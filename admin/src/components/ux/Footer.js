// @flow

import React from 'react'
import classnames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Toolbar from 'material-ui/Toolbar'

const Footer = ({ children, classes, className, ...props }) => {
  return (
    <Toolbar className={classnames(classes.footer, className)} {...props}>
      {children}
    </Toolbar>
  )
}

const styles = theme => ({
  footer: {
    position: 'fixed',
    zIndex: theme.zIndex.appBar,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: theme.palette.grey[200],
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    [theme.breakpoints.up(theme.drawer.breakpoint)]: {
      left: theme.drawer.width,
    },
  },
  [theme.breakpoints.up(theme.drawer.breakpoint)]: {
    footer: {
      left: theme.drawer.width,
    },
  },
})

export default withStyles(styles)(Footer)
