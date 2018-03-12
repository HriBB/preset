// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { compose, getContext } from 'recompose'
import { Link, NavLink } from 'react-router-dom'

import withWidth, { isWidthUp } from 'material-ui/utils/withWidth'
import { withStyles } from 'material-ui/styles'
import Toolbar from 'material-ui/Toolbar'
import MuiDrawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
} from 'material-ui/List'
import InboxIcon from 'material-ui-icons/Inbox'

const Drawer = props => {
  const { classes, drawer, models, open, theme, width } = props
  const isWidthUpSm = isWidthUp(theme.drawer.breakpoint, width)
  const variant = isWidthUpSm ? 'permanent' : 'temporary'
  return (
    <MuiDrawer
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      open={isWidthUpSm || open}
      variant={variant}
      onClose={drawer.toggle}
    >
      <Toolbar className={classes.drawerToolbar}>
        <Link to={'/'} className={classes.drawerTitle}>
          {'Preset CMS'}
        </Link>
      </Toolbar>
      <List className={classes.drawerList} component={'nav'}>
        {models.map(model => (
          <ListItem
            className={classes.drawerListItem}
            key={model.name}
            component={NavLink}
            to={`/${model.name}`}
            onClick={drawer.toggle}
            button
            >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={model.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List className={classes.drawerList} component={'nav'}>
        <ListItem
          className={classes.drawerListItem}
          component={Link}
          to={'/user'}
          onClick={drawer.toggle}
          button
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={'User'} />
        </ListItem>
      </List>
    </MuiDrawer>
  )
}

const styles = theme => ({
  drawer: {
    width: theme.drawer.width,
  },
  drawerPaper: {
    width: theme.drawer.width,
  },
  drawerTitle: {
    ...theme.typography.title,
    color: '#000',
    textDecoration: 'none',
  },
  drawerToolbar: {
    padding: `0 ${theme.spacing.unit * 3}px`,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  drawerList: {
    flex: '0 1 auto',
  },
  drawerListItem: {
    paddingLeft: theme.spacing.unit * 3,
    '& svg': {
      marginRight: 0,
    },
  },

})

export default compose(
  getContext({ drawer: PropTypes.object }),
  withWidth({ withTheme: true }),
  withStyles(styles),
)(Drawer)
