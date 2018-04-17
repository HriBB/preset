// @flow

import React from 'react'
import { compose } from 'recompose'
import { Form, Field, reduxForm } from 'redux-form'
import { Trans } from '@lingui/react'
import { withStyles } from 'material-ui/styles'
import { Text } from 'components/Form'

const PresetForm = props => {
  const { classes, handleSubmit } = props
  return (
    <Form className={classes.root} onSubmit={handleSubmit}>
      <Field
        component={Text}
        className={classes.field}
        name={'title'}
        label={<Trans>Title</Trans>}
      />
      <Field
        component={Text}
        className={classes.field}
        name={'slug'}
        label={<Trans>Slug</Trans>}
      />
    </Form>
  )
}

const styles = (theme) => ({
  root: {
    margin: '0 auto',
    padding: '8px 70px 16px 16px',
    [theme.breakpoints.up('sm')]: {
      padding: '8px 90px 24px 24px',
      maxWidth: '540px',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '720px',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '960px',
    },
  },
  field: {
    width: '100%',
    marginBottom: theme.spacing.unit * 3,
  },
})

const validate = (fields, { model }) => {
  const errors = {}
  return errors
}

export default compose(
  withStyles(styles),
  reduxForm({ validate }),
)(PresetForm)
