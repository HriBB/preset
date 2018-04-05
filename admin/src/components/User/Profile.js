// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Form, Field, reduxForm, SubmissionError } from 'redux-form'
import { mutation } from 'react-apollo/mutation-hoc'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { CardHeader, CardContent } from 'material-ui/Card'
import red from 'material-ui/colors/red'
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'
import {
  Body,
  Header,
  Content,
  LanguageSwitcher,
  UserIcon,
} from 'components/ux'

import { AppQuery } from 'components/App'
import { Upload } from 'components/Form'

import setProfilePictureMutation from './setProfilePicture.graphql'

const User = (props) => {
  const { classes, error, handleSubmit, viewer } = props
  const { username, email, image } = viewer
  return (
    <Body>
      <Header title={<Trans>Profile</Trans>}>
        <LanguageSwitcher />
        <UserIcon />
      </Header>
      <Content>
        <Form className={classes.form} onSubmit={handleSubmit}>
          <CardHeader
            className={classes.header}
            avatar={
              <Avatar aria-label={username} className={classes.avatar}>
                {username.substring(0, 1)}
              </Avatar>
            }
            title={username}
            subheader={email}
          />
          <CardContent className={classes.content}>
            <div className={classes.uploadWrap}>
              <Field
                component={Upload}
                className={classes.upload}
                name={'image'}
                label={<Trans>Image</Trans>}
              />
              <Button
                size={'small'}
                color={'primary'}
                type={'submit'}
                variant={'raised'}
              >
                <Trans>Upload</Trans>
              </Button>
            </div>
            {image && (
              <img
                className={classes.image}
                src={image.url}
                alt={image.filename}
              />
            )}
            <FormControl error className={classes.error}>
              <FormHelperText>{error || '\u00A0'}</FormHelperText>
            </FormControl>
          </CardContent>
        </Form>
      </Content>
    </Body>
  )
}

const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    paddingRight: theme.spacing.unit * 2 + 4,
  },
  avatar: {
    backgroundColor: red[500],
  },
  content: {},
  uploadWrap: {
    display: 'flex',
    alignItems: 'center',
  },
  upload: {
    margin: `0 ${theme.spacing.unit}px ${theme.spacing.unit * 2}px 0`,
  },
  image: {
    maxWidth: '150px',
  },
  actions: {
    justifyContent: 'flex-end',
  },
})

const updateProfilePicture = (proxy, { data: { setProfilePicture } }) => {
  const data = proxy.readQuery({ query: AppQuery })
  data.viewer.image = setProfilePicture
  proxy.writeQuery({ query: AppQuery, data })
}

export default compose(
  getContext({
    viewer: PropTypes.object,
    snackbar: PropTypes.object,
  }),
  withStyles(styles),
  mutation(setProfilePictureMutation, {
    props: ({ props, mutate }) => ({
      setProfilePicture: image =>
        mutate({
          variables: { image },
          update: updateProfilePicture,
        }),
    }),
  }),
  withHandlers({
    onSubmit: ({ snackbar, setProfilePicture }) => ({ image }) =>
      setProfilePicture(image[0])
        .then(({ data: { setProfilePicture } }) => {
          snackbar.show(<Trans>Done</Trans>)
        })
        .catch(error => {
          throw new SubmissionError({ _error: error.message })
        }),
  }),
  reduxForm({
    form: 'user',
    validate: () => ({}),
  })
)(User)
