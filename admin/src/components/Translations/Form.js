// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, getContext, withHandlers } from 'recompose'
import { mutation } from 'react-apollo/mutation-hoc'
import { Form, reduxForm, getFormValues } from 'redux-form'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { CardContent } from 'material-ui/Card'

import Field from './Field'
import updateTranslationsMutation from './updateTranslations.graphql'

const TranslationForm = (props) => {
  const { classes, error, handleSubmit, initialValues, values, ns } = props
  return (
    <CardContent className={classes.content}>
      <Form onSubmit={handleSubmit}>
        {Object.keys(initialValues[ns]).map((key) => (
          <Field
            key={key}
            data={values[ns][key]}
            change={props.change}
          />
        ))}
      </Form>
      <FormControl error className={classes.error}>
        <FormHelperText>{error || '\u00A0'}</FormHelperText>
      </FormControl>
    </CardContent>
  )
}

const styles = theme => ({
  content: {
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 3,
    },
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
  withStyles(styles),
  getContext({
    dialog: PropTypes.object,
    snackbar: PropTypes.object,
  }),
  mutation(updateTranslationsMutation, {
    props: ({ props, mutate }) => ({
      updateTranslations: data =>
        mutate({
          variables: { data },
        }),
    }),
  }),
  withHandlers({
    onSubmit: (props) => (data) => {
      const { initialValues, lang, ns } = props

      if (data === initialValues) {
        //return console.log('the same, skip update')
      }

      const changed = Object.keys(data[ns])
        //.filter(key => data[ns][key] !== initialValues[ns][key])
        .map(key => ({
          id: data[ns][key].id,
          lang: lang.toUpperCase(),
          ns,
          key,
          value: data[ns][key].value,
          editor: data[ns][key].editor,
        }))

      return props.updateTranslations(changed)
        .then(({ data }) => {
          props.snackbar.show(
            <Trans>Translations saved</Trans>
          )
        })
        .catch(error => {
          console.log(error)
          //props.dialog.show(<Trans>Error</Trans>, error)
        })
    },
  }),
  reduxForm({
    validate,
    destroyOnUnmount: false,
  }),
  connect(
    (state, { form }) => ({
      values: getFormValues(form)(state),
    }),
  ),
)(TranslationForm)
