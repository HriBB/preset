// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { SubmissionError } from 'redux-form'
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
          {Object.keys(keys).map((key) => (
            <Field
              key={keys[key].id}
              component={getEditor(keys[key].editor)}
              className={classes.field}
              name={`${keys[key].id}.value`}
              label={keys[key].id}
            />
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
    display: 'none',
    justifyContent: 'flex-end',
  },
})

const validate = (fields, { model }) => {
  const errors = {}
  return errors
}

export default compose(
  getContext({
    snackbar: PropTypes.object,
  }),
  withStyles(styles),
  withI18n(),
  withHandlers({
    onSubmit: ({ i18n, snackbar, updateTranslations }) => (data) =>
      updateTranslations(i18n.language, data)
        .then(({ data: { updateTranslations } }) =>
          snackbar.show(<Trans>Done</Trans>)
        )
        .catch(error => {
          throw new SubmissionError({ _error: error.message })
        }),
  }),
  reduxForm({
    //form: 'translations',
    validate,
  }),
)(TranslationForm)
