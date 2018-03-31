// @flow

import React, { Fragment } from 'react'
import { compose } from 'recompose'
import { Form, Field, reduxForm } from 'redux-form'
import { Trans, withI18n } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'

import { Text, Textarea } from 'components/Form'

const getEditor = (editor) => {
  switch (editor) {
    case 'Text': return Text
    case 'Textarea': return Textarea
    default: return Text
  }
}

const TranslationForm = props => {
  const { classes, error, handleSubmit, keys } = props
  return (
    <Fragment>
      <CardContent className={classes.content}>
        <Form onSubmit={handleSubmit}>
          {keys.map(({ id, editor }) => (
            <div key={id}>
              <Field
                component={getEditor(editor)}
                className={classes.field}
                name={id}
                label={id}
              />
            </div>
          ))}
        </Form>
        <FormControl error className={classes.error}>
          <FormHelperText>{error || '\u00A0'}</FormHelperText>
        </FormControl>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button color={'secondary'} variant={'raised'} onClick={handleSubmit}>
          {<Trans>Save</Trans>}
        </Button>
      </CardActions>
    </Fragment>
  )
}

const styles = theme => ({
  content: {
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 3,
    },
  },
  field: {
    width: '100%',
    marginBottom: theme.spacing.unit * 2,
  },
  image: {
    maxWidth: '150px',
  },
  actions: {
    justifyContent: 'flex-end',
  },
})

const validate = (fields, { model }) => {
  const errors = {}
  return errors
}

export default compose(
  withStyles(styles),
  withI18n(),
  reduxForm({
    form: 'translations',
    validate,
  }),
)(TranslationForm)
