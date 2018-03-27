// @flow

import React from 'react'
import { withStyles } from 'material-ui/styles'

const Error = ({ children, classes, ...other }: any) => {
  return (
    <p {...other} className={classes.root}>
      {children.message || children}
    </p>
  )
}

const styles = theme => ({
  root: {
    textAlign: 'center',
    fontSize: '1.2rem',
    maxWidth: '772px',
    margin: '0 auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 3,
    },
  },
})

export default withStyles(styles)(Error)
