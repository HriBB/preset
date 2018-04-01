// @flow

import React from 'react'
import { compose, withHandlers, withStateHandlers } from 'recompose'
import { Field } from 'redux-form'
import { Trans, i18nMark, withI18n } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import TextFieldsIcon from 'material-ui-icons/TextFields'

import { Text, Textarea } from 'components/Form'

const getEditor = (editor) => {
  switch (editor) {
    case 'Text': return Text
    case 'Textarea': return Textarea
    default: return Text
  }
}

const editors = [
  i18nMark('Text'),
  i18nMark('Textarea'),
]

const TranslationField = (props) => {
  const { classes, data, open } = props
  const { key, editor } = data
  return (
    <div className={classes.wrap}>
      <IconButton
        className={classes.icon}
        onClick={props.openMenu}
        data-id={key}
      >
        <TextFieldsIcon />
      </IconButton>
      <Field
        className={classes.field}
        component={getEditor(editor)}
        name={`${key}.value`}
        label={key}
      />
      <Menu
        anchorEl={open}
        open={Boolean(open)}
        onClose={props.closeMenu}
      >
        {editors.map((name, index) =>
          <MenuItem
            key={name}
            className={editor === name ? classes.active : ''}
            data-editor={name}
            onClick={props.setEditor}
          >
            <Trans>{name}</Trans>
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}

const styles = theme => ({
  wrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  field: {
    width: '100%',
    marginBottom: theme.spacing.unit * 2,
  },
  active: {
    backgroundColor: theme.palette.grey[300],
  },
  icon: {
    marginLeft: -theme.spacing.unit * 1.5,
    marginRight: theme.spacing.unit * 0.5,
    [theme.breakpoints.up('sm')]: {
      marginLeft: -theme.spacing.unit * 2.5,
      marginRight: theme.spacing.unit * 0.5,
    },
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
  withHandlers({
    setEditor: (props) => (e) => {
      const { data: { key } } = props
      const { editor } = e.currentTarget.dataset
      props.change(`${key}.editor`, editor)
      props.closeMenu()
    },
  }),
)(TranslationField)