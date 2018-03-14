// @flow

import React from 'react'

import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import MuiDialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

const Dialog = ({ classes, open, onClose, title, content }) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      aria-labelledby={'dialog-title'}
      aria-describedby={'dialog-content'}
    >
      <DialogTitle id={'dialog-title'}>
        {title || ''}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <DialogContentText id={'dialog-content'}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color={'primary'} autoFocus>
          Close
        </Button>
      </DialogActions>
    </MuiDialog>
  )
}

const styles = theme => ({
  content: {
    minWidth: '300px',
  },
})

export default withStyles(styles)(Dialog)
