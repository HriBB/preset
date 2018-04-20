// @flow

import React from 'react'

import { withStyles } from 'material-ui/styles'
import Card from 'material-ui/Card'
import classnames from 'classnames'

const Content = (props) => {
  const {
    classes,
    className,
    cardClassName,
    children,
    fluid,
    plain,
    withFooter,
    ...other
  } = props
  const rootClass = classnames(
    classes.root, 
    {
      [classes.fluid]: fluid,
      [classes.withFooter]: withFooter,
    },
    className,
  )
  if (plain) {
    return (
      <div className={rootClass} {...other}>
        {children}
      </div>
    )
  }
  return (
    <div className={rootClass} {...other}>
      <Card className={cardClassName}>
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
  fluid: {
    maxWidth: 'none',
  },
  withFooter: {
    marginBottom: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing.unit * 8,
    },
  },
})

export default withStyles(styles)(Content)
