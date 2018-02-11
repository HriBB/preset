// @flow

import React from 'react'
import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'

const Spinner = ({ classes, ...other }: any) => {
  return (
    <CircularProgress {...other} className={classes.spinner} />
  )
}

const styles = (theme) => ({
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    margin: '-25px 0 0 -25px',
    width: '50px',
    height: '50px',
  },
})

export default withStyles(styles)(Spinner)