// @flow

import React from 'react'

import { withStyles } from 'material-ui/styles'
import Card from 'material-ui/Card'

function AppContent(props) {
  const { classes, children } = props
  return (
    <Card className={classes.card}>
      {children}
    </Card>
  )
}

const styleSheet = (theme: any) => ({
  card: {
    margin: theme.spacing.unit * 3,
  },
})

export default withStyles(styleSheet)(AppContent)
