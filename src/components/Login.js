// @flow

import React from 'react'
import { compose, withHandlers } from 'recompose'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { mutation, withApollo } from 'react-apollo'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

import { Text } from 'components/form'
import { loginMutation } from 'preset/mutations'

const Login = props => {
  const { classes, error, handleSubmit } = props
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Typography
        className={classes.title}
        variant={'headline'}
        component={'h2'}
      >
        Preset CMS
      </Typography>
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <Field
            component={Text}
            className={classes.field}
            inputClassName={classes.input}
            name={'username'}
            label={<Trans>cms.username</Trans>}
          />
          <Field
            component={Text}
            className={classes.field}
            inputClassName={classes.input}
            name={'password'}
            label={<Trans>cms.password</Trans>}
            type={'password'}
          />
          <FormControl error className={classes.error}>
            <FormHelperText>{error || '\u00A0'}</FormHelperText>
          </FormControl>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button color={'primary'} variant={'raised'} onClick={handleSubmit}>
            <Trans>cms.login</Trans>
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}

const styles = theme => ({
  form: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '300px',
    padding: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 6,
  },
  content: {
    padding: '0',
  },
  title: {
    marginBottom: theme.spacing.unit * 4,
  },
  field: {
    //border: '1px solid red',
    width: '100%',
    maxWidth: '360px',
    marginBottom: theme.spacing.unit * 2,
  },
  input: {
    //border: '1px solid green',
  },
  error: {
    minHeight: '40px',
  },
  actions: {
    padding: '0',
    justifyContent: 'flex-end',
  },
})

export default compose(
  withStyles(styles),
  withApollo,
  mutation(loginMutation, {
    props: ({ ownProps, mutate }) => ({
      login: (username, password) =>
        mutate({
          variables: { username, password },
        }),
    }),
  }),
  withHandlers({
    onSubmit: ({ client, login }) => ({ username, password }) => {
      return login(username, password)
        .then(({ data: { login: { token } } }) => {
          localStorage.setItem('token', token)
          client.resetStore()
        })
        .catch(error => {
          throw new SubmissionError({ _error: error.message })
        })
    },
  }),
  reduxForm({
    form: 'login',
    validate: ({ username, password }) => {
      const errors = {}
      if (!username) {
        errors.username = 'Required'
      } else if (username.length < 3 || username.length > 50) {
        errors.username = 'Must be between 3 and 50 characters'
      }
      if (!password) {
        errors.password = 'Required'
      } else if (password.length < 6) {
        errors.password = 'Must be at least 6 characters long'
      }
      return errors
    },
  })
)(Login)
