// @flow

import React from 'react'
import { compose } from 'recompose'
import { Link } from 'react-router-dom'
import { withI18n } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import { default as MuiList, ListItem, ListItemText } from 'material-ui/List'

const List = ({ classes, i18n, match }) => {
  const { _catalogs: c } = i18n
  const languages = Object.keys(c)
  const namespaces = Object.keys(c[languages[0]].messages)
    .map(id => id.split('.')[0])
    .filter((el, pos, arr) => arr.indexOf(el) === pos)

  return (
    <MuiList className={classes.root} component={'ul'}>
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
    </MuiList>
  )
}

const styles = theme => ({
  root: {
    //marginTop: theme.spacing.unit * 2,
  },
})

export default compose(
  withStyles(styles),
  withI18n(),
)(List)
