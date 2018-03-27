// @flow

import React from 'react'
import { compose } from 'recompose'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List'

import messages from './messages'

const TranslationList = ({ classes, match }) => {
  const namespaces = messages
    .map(id => id.split('.')[0])
    .filter((el, pos, arr) => arr.indexOf(el) === pos)

  return (
    <List className={classes.root} component={'ul'}>
      {namespaces.map(namespace => (
        <ListItem
          key={namespace}
          button
          component={Link}
          to={`/translations/${namespace}`}
        >
          <ListItemText primary={namespace} />
        </ListItem>
      ))}
    </List>
  )
}

const styles = theme => ({
  root: {
    //marginTop: theme.spacing.unit * 2,
  },
})

export default compose(
  withStyles(styles),
)(TranslationList)
