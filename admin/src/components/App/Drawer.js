// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { compose, getContext, withStateHandlers } from 'recompose'
import { Link, NavLink } from 'react-router-dom'
import { Trans, withI18n } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import Toolbar from 'material-ui/Toolbar'
import MuiDrawer from 'material-ui/Drawer'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Collapse from 'material-ui/transitions/Collapse'

import { Models } from 'components/Preset'
import { namespaces } from 'components/Translations'

const Drawer = (props) => {
  const { classes, drawer, expand, open, variant } = props
  return (
    <MuiDrawer
      className={classes.drawer}
      classes={{ paper: classes.paper }}
      open={open}
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
          button
          className={classes.item}
          component={NavLink}
          onClick={drawer.close}
          to={'/pages'}
        >
          <ListItemText
            className={classes.itemText}
            disableTypography
            primary={<Trans>Pages</Trans>}
          />
        </ListItem>

        <ListItem
          button
          className={classes.item}
          data-id={'model'}
          onClick={props.handleClick}
        >
          <ListItemText
            className={classes.itemText}
            disableTypography
            primary={<Trans>Posts</Trans>}
          />
        </ListItem>

        <Collapse in={expand.model} timeout={'auto'} unmountOnExit>
          <List disablePadding>
            <Models>
              {({ error, loading, models }) => 
                models.map(model =>
                  <ListItem
                    key={model.name}
                    button
                    className={classes.item2}
                    component={NavLink}
                    to={`/model/${model.name}`}
                    onClick={drawer.close}
                  >
                    <ListItemText
                      className={classes.item2Text}
                      disableTypography
                      primary={<Trans id={`${model.name}_plural`} />}
                    />
                  </ListItem>
                )
              }
            </Models>
          </List>
        </Collapse>

        <ListItem
          button
          className={classes.item}
          data-id={'translations'}
          onClick={props.handleClick}
        >
          <ListItemText
            className={classes.itemText}
            disableTypography
            primary={<Trans>Translations</Trans>}
          />
        </ListItem>

        <Collapse in={expand.translations} timeout={'auto'} unmountOnExit>
          <List disablePadding>
            {namespaces.map(ns => 
              <ListItem
                key={ns}
                button
                className={classes.item2}
                component={NavLink}
                onClick={drawer.close}
                to={`/translations/${ns}`}
              >
                <ListItemText
                  className={classes.item2Text}
                  disableTypography
                  primary={ns.charAt(0).toUpperCase() + ns.slice(1)}
                />
              </ListItem>
            )}
          </List>
        </Collapse>

        <ListItem
          button
          className={classes.item}
          data-id={'user'}
          onClick={props.handleClick}
        >
          <ListItemText
            className={classes.itemText}
            disableTypography
            primary={<Trans>User</Trans>}
          />
        </ListItem>

        <Collapse in={expand.user} timeout={'auto'} unmountOnExit>
          <List disablePadding>
            <ListItem
              button
              className={classes.item2}
              component={NavLink}
              onClick={drawer.close}
              to={'/user'}
            >
              <ListItemText
                className={classes.item2Text}
                disableTypography
                primary={<Trans>Profile</Trans>}
              />
            </ListItem>
            <ListItem
              button
              className={classes.item2}
              component={NavLink}
              onClick={drawer.close}
              to={'/user/list'}
            >
              <ListItemText
                className={classes.item2Text}
                disableTypography
                primary={<Trans>List</Trans>}
              />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          button
          className={classes.item}
          component={NavLink}
          onClick={drawer.close}
          to={'/deploy'}
        >
          <ListItemText
            className={classes.itemText}
            disableTypography
            primary={<Trans>Deploy</Trans>}
          />
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
  itemText: {
    //fontSize: '0.875rem',
    fontWeight: theme.typography.fontWeightMedium,
  },
  item2: {
    paddingLeft: theme.spacing.unit * 6,
    '& svg': {
      marginRight: 0,
    },
    '&.active': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  item2Text: {
    //fontSize: '0.875rem',
    fontWeight: theme.typography.fontWeightLight,
    color: theme.palette.grey[700],
  },
})

const findId = ({ dataset, parentNode }) => {
  return dataset && dataset.id ? dataset.id : findId(parentNode)
}

export default compose(
  getContext({
    drawer: PropTypes.object,
  }),
  withStyles(styles),
  withI18n(),
  // TODO: put in redux
  withStateHandlers(
    ({ page }) => ({ expand: { [page]: true } }),
    {
      handleClick: ({ expand }) => (e) => {
        const id = findId(e.target)
        expand[id] = !expand[id]
        return expand
      },
    }
  ),
)(Drawer)
