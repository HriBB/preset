// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { compose, getContext } from 'recompose'
import { Link, NavLink } from 'react-router-dom'
import { Trans } from '@lingui/react'

import withWidth, { isWidthUp } from 'material-ui/utils/withWidth'
import { withStyles } from 'material-ui/styles'
import Toolbar from 'material-ui/Toolbar'
import MuiDrawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'

import InboxIcon from 'material-ui-icons/Inbox'
import TranslateIcon from 'material-ui-icons/Translate'

const Drawer = props => {
  const { classes, drawer, models, open, theme, width } = props
  const isWidthUpSm = isWidthUp(theme.drawer.breakpoint, width)
  const variant = isWidthUpSm ? 'permanent' : 'temporary'
  return (
    <MuiDrawer
      className={classes.drawer}
      classes={{ paper: classes.paper }}
      open={isWidthUpSm || open}
      variant={variant}
      onClose={drawer.toggle}
    >
      <Toolbar className={classes.toolbar}>
        <Link to={'/'} className={classes.title}>
          Preset CMS
        </Link>
      </Toolbar>
      <List className={classes.list} component={'nav'}>
        <ListItem
          className={classes.item}
          component={NavLink}
          to={'/translations/'}
          onClick={drawer.toggle}
          button
        >
          <ListItemIcon>
            <TranslateIcon />
          </ListItemIcon>
          <ListItemText primary={<Trans>cms.translations</Trans>} />
        </ListItem>
        {models.map(model => (
          <ListItem
            className={classes.item}
            key={model.name}
            component={NavLink}
            to={`/${model.name}`}
            onClick={drawer.toggle}
            button
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={<Trans id={model.name} />} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List className={classes.list} component={'nav'}>
        <ListItem
          className={classes.item}
          component={NavLink}
          to={'/user'}
          onClick={drawer.toggle}
          button
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={<Trans>cms.user</Trans>} />
        </ListItem>
      </List>
    </MuiDrawer>
  )
}

const styles = theme => ({
  drawer: {
    width: theme.drawer.width,
  },
  paper: {
    width: theme.drawer.width,
  },
  title: {
    ...theme.typography.title,
    color: '#000',
    textDecoration: 'none',
  },
  toolbar: {
    padding: `0 ${theme.spacing.unit * 3}px`,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  list: {
    flex: '0 1 auto',
  },
  item: {
    paddingLeft: theme.spacing.unit * 3,
    '& svg': {
      marginRight: 0,
    },
    '&.active': {
      backgroundColor: theme.palette.action.hover,
    },
  },
})

export default compose(
  getContext({ drawer: PropTypes.object }),
  withWidth({ withTheme: true }),
  withStyles(styles)
)(Drawer)
