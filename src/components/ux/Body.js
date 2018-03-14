// @flow

import React from 'react'

import { withStyles } from 'material-ui/styles'

const Body = ({ classes, children }: any) => (
  <div className={classes.root}>
    {children}
  </div>
)

const styles = theme => ({
  root: {
    position: 'relative',
    flex: '1',
    minHeight: '100vh',
    background: theme.palette.grey[100],
  },
})

export default withStyles(styles)(Body)
