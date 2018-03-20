// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Form, Field, reduxForm, SubmissionError } from 'redux-form'
import { mutation } from 'react-apollo'
import { Trans, withI18n } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import { CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'

import { updateTranslationsMutation } from 'preset/mutations'

import { Text } from 'components/form'

const TranslationForm = props => {
  const { classes, handleSubmit, i18n, match } = props
  const { _catalogs: c } = i18n
  const languages = Object.keys(c)
  const messages = Object.keys(c[languages[0]].messages)
    .filter(message => message.split('.')[0] === match.params.namespace)

  return (
    <Fragment>
      <CardContent className={classes.content}>
        <Form onSubmit={handleSubmit}>
          {messages.map(message => (
            <div key={message}>
              <Field
                component={Text}
                className={classes.field}
                name={message}
                label={message}
              />
            </div>
          ))}
        </Form>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button color={'secondary'} variant={'raised'} onClick={handleSubmit}>
          {<Trans>cms.save</Trans>}
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
  getContext({
    snackbar: PropTypes.object,
  }),
  withI18n(),
  withStyles(styles),
  mutation(updateTranslationsMutation, {
    props: ({ props, mutate }) => ({
      saveTranslations: image =>
        mutate({
          variables: { image },
        }),
    }),
  }),
  withHandlers({
    onSubmit: (props) => (fields) => {
      console.log(props)
      console.log(fields)
      console.log(SubmissionError)
      /*
      //{ snackbar, saveTranslations }
      return saveTranslations(image[0])
        .then(({ data: { saveTranslations } }) => {
          snackbar.show(<Trans>cms.done</Trans>)
        })
        .catch(error => {
          throw new SubmissionError({ _error: error.message })
        })
      */
    },
  }),
  reduxForm({
    form: 'translations',
    validate,
  }),
)(TranslationForm)
