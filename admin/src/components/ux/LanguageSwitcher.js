// @flow

import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { compose, withStateHandlers } from 'recompose'
import { Trans, withI18n, i18nMark } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'

import { actions } from 'components/App'

const languages = {
  si: i18nMark('si'),
  en: i18nMark('en'),
}

const origin = { vertical: 'top', horizontal: 'right' }

const LanguageSwitch = ({ classes, i18n, open, ...props }) => {
  return (
    <Fragment>
      <IconButton className={classes.icon} onClick={props.openMenu} color={'inherit'}>
        <Typography className={classes.lang} component={'span'} color={'inherit'}>
          {i18n.language}
        </Typography>
      </IconButton>
      <Menu
        anchorEl={open}
        open={Boolean(open)}
        onClose={props.closeMenu}
        anchorOrigin={origin}
        transformOrigin={origin}
      >
        <MenuItem className={classes.header}>
          <Trans>Language</Trans>
        </MenuItem>
        {Object.keys(languages).map(lang =>
          <MenuItem
            key={lang}
            className={i18n.language === lang ? classes.active : ''}
            data-lang={lang}
            onClick={props.setLanguage}
          >
            <Trans id={languages[lang]} />
          </MenuItem>
        )}
      </Menu>
    </Fragment>
  )
}

const styles = theme => ({
  icon: {
    marginRight: theme.spacing.unit,
  },
  lang: {
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '500',
  },
  header: {
    height: 'auto',
    fontSize: theme.typography.title.fontSize,
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
      cursor: 'default',
    },
  },
  active: {
    backgroundColor: theme.palette.grey[300],
  },
})

const findButton = (node) => (
  node.tagName.toLowerCase() === 'button' ? node : findButton(node.parentNode)
)

export default compose(
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
