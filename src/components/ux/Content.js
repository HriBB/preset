// @flow

import React from 'react'

import { withStyles } from 'material-ui/styles'
import Card from 'material-ui/Card'

function Content(props) {
  const { classes, children } = props
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        {children}
      </Card>
    </div>
  )
}

const styles = theme => ({
  root: {
    maxWidth: '772px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 3,
    },
  },
})

export default withStyles(styles)(Content)
