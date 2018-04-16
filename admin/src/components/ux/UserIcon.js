// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, withStateHandlers, getContext } from 'recompose'
import { Link } from 'react-router-dom'
import { Trans, withI18n } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import Menu, { MenuItem } from 'material-ui/Menu'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import PersonIcon from 'material-ui-icons/Person'

import { actions } from 'components/App'

const origin = { vertical: 'top', horizontal: 'right' }

const LanguageSwitch = ({ classes, viewer, open, ...props }) => {
  const { username, email, image } = viewer
  const avatar = image && image.url
  return (
    <Fragment>
      <IconButton onClick={props.openMenu} color={'inherit'}>
        <Avatar className={classes.avatar} src={avatar}>
          {!avatar && <PersonIcon />}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={open}
        open={Boolean(open)}
        onClose={props.closeMenu}
        anchorOrigin={origin}
        transformOrigin={origin}
      >
        <MenuItem className={classes.header}>
          <Typography className={classes.username}>
            {username}
          </Typography>
          <Typography className={classes.email}>
            {email}
          </Typography>
        </MenuItem>
        <MenuItem className={classes.item} component={Link} to={'/user'}>
          <Trans>Profile</Trans>
        </MenuItem>
        <MenuItem className={classes.item} onClick={viewer.logout}>
          <Trans>Logout</Trans>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

const styles = theme => ({
  avatar: {
    width: 36,
    height: 36,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: 'auto',
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
      cursor: 'default',
    },
  },
  username: {
    fontSize: theme.typography.title.fontSize,
  },
  email: {
    color: theme.typography.caption.color,
  },
})

const findButton = (node) => (
  node.tagName.toLowerCase() === 'button' ? node : findButton(node.parentNode)
)

export default compose(
  getContext({
    viewer: PropTypes.object,
  }),
  withStyles(styles),
  withI18n(),
  withStateHandlers(
    ({ open = null }) => ({ open }),
    {
      openMenu: ({ open }) => (e) => ({ open: findButton(e.target) }),
      closeMenu: ({ open }) => (e) => ({ open: null }),
    }
  ),
  connect(
    () => ({}),
    (dispatch, props) => ({
      setLanguage: (e) => {
        const { lang } = e.currentTarget.dataset
        props.closeMenu()
        props.i18n.use(lang)
        return dispatch(actions.setLanguage(lang))
      },
    }),
  ),
)(LanguageSwitch)
