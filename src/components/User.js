// @flow

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { graphql, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { CardHeader, CardContent } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'
import CloseIcon from 'material-ui-icons/Close'

import { Upload } from 'components/form'
import { appQuery } from 'preset/queries'
import { setProfilePictureMutation } from 'preset/mutations'

import { Header, Content }  from 'components/ux'

const User = props => {
  const { classes, error, handleSubmit, user } = props

  return (
    <Fragment>
      <Header title={<Trans>User</Trans>}>
        <IconButton component={Link} to={`/`} color={'inherit'}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Content>
        <form className={classes.form} onSubmit={handleSubmit}>
          <CardHeader
            className={classes.header}
            avatar={
              <Avatar aria-label={user.username} className={classes.avatar}>
                {user.username.substring(0, 1)}
              </Avatar>
            }
            title={user.username}
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
            {user.image && (
              <img
                className={classes.image}
                src={user.image.url}
                alt={user.image.filename}
              />
            )}
            <FormControl error className={classes.error}>
              <FormHelperText>{error || '\u00A0'}</FormHelperText>
            </FormControl>
          </CardContent>
        </form>
      </Content>
    </Fragment>
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
  },
  content: {},
  uploadWrap: {
    display: 'flex',
    alignItems: 'center',
  },
  upload: {
    //width: '250px',
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
  const data = proxy.readQuery({ query: appQuery })
  data.user.image = setProfilePicture
  proxy.writeQuery({ query: appQuery, data })
}

export default compose(
  getContext({
    snackbar: PropTypes.object,
  }),
  withStyles(styles),
  withApollo,
  graphql(setProfilePictureMutation, {
    props: ({ props, mutate }) => ({
      setProfilePicture: (image) =>
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
