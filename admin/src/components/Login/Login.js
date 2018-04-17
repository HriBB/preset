// @flow

import React from 'react'
import { compose, withHandlers } from 'recompose'
import { Form, Field, reduxForm, SubmissionError } from 'redux-form'
import { withApollo } from 'react-apollo'
import { mutation } from 'react-apollo/mutation-hoc'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'


import { Body, Header } from 'components/ux'
import { Text } from 'components/Form'
import loginMutation from './login.graphql'

const Login = props => {
  const { classes, error, handleSubmit } = props
  return (
    <Body>
      <Header title={<Trans>Preset CMS</Trans>} />
        <Form className={classes.form} onSubmit={handleSubmit}>
          <Typography
            className={classes.title}
            variant={'headline'}
            component={'h2'}
          >
            <Trans>Sign In</Trans>
          </Typography>
          <Card className={classes.card}>
            <CardContent className={classes.content}>
              <Field
                component={Text}
                className={classes.field}
                inputClassName={classes.input}
                name={'username'}
                label={<Trans>Username</Trans>}
              />
              <Field
                component={Text}
                className={classes.field}
                inputClassName={classes.input}
                name={'password'}
                label={<Trans>Password</Trans>}
                type={'password'}
              />
              <FormControl error className={classes.error}>
                <FormHelperText>{error || '\u00A0'}</FormHelperText>
              </FormControl>
            </CardContent>
            <CardActions className={classes.actions}>
              <Button color={'primary'} variant={'raised'} onClick={handleSubmit}>
                <Trans>Login</Trans>
              </Button>
            </CardActions>
          </Card>
        </Form>
    </Body>
  )
}

const styles = theme => ({
  form: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '300px',
    padding: theme.spacing.unit * 4,
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

const validate = ({ username, password }) => {
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
}

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
    onSubmit: ({ client, login }) => ({ username, password }) =>
      login(username, password)
        .then(({ data: { login: { token } } }) => {
          localStorage.setItem('token', token)
          client.resetStore()
        })
        .catch(error => {
          throw new SubmissionError({ _error: error.message })
        }),
  }),
  reduxForm({
    form: 'login',
    validate,
  })
)(Login)
