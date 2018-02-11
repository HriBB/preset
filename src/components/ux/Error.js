// @flow

import React from 'react'
import { withStyles } from 'material-ui/styles'

const Error = ({ children, classes, ...other }: any) => {
  return (
    <p {...other} className={classes.error}>
      {children.message || children}
    </p>
  )
}

const styles = (theme) => ({
  error: {
    textAlign: 'center',
    fontSize: '1.2rem',
  },
})

export default withStyles(styles)(Error)