// @flow

import React from 'react'
import { compose } from 'recompose'
import { withI18n } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
})

const SimpleSnackbar = props => {
  const { classes, i18n, open, onClose, message } = props
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      SnackbarContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id={'message-id'}>{message || 'Done!'}</span>}
      action={
        <IconButton
          key={'close'}
          aria-label={i18n._('Close')}
          color={'inherit'}
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      }
    />
  )
}

export default compose(
  withI18n(),
  withStyles(styles),
)(SimpleSnackbar)
