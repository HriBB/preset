// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { graphql, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { CardHeader, CardContent } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'
import CloseIcon from 'material-ui-icons/Close'

import { Upload } from 'components/form'
import { query as appQuery } from 'components/App'

const User = (props) => {
  const { classes, error, handleSubmit, user } = props

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <CardHeader
        className={classes.header}
        avatar={
          <Avatar aria-label={user.username} className={classes.avatar}>
            {user.username.substring(0,1)}
          </Avatar>
        }
        action={
          <IconButton component={Link} to={`/`}>
            <CloseIcon />
          </IconButton>
        }
        title={user.username}
      />
      <CardContent className={classes.content}>
        <div className={classes.uploadWrap}>
          <Field
            component={Upload}
            className={classes.upload}
            name={'image'}
            label={'Image'}
          />
          <Button color={'primary'} type={'submit'} variant={'raised'}>
            {'Submit'}
          </Button>
        </div>
        {user.image &&
          <img className={classes.image} src={user.image.url} alt={user.image.filename} />
        }
        <FormControl error className={classes.error}>
          <FormHelperText>{error || '\u00A0'}</FormHelperText>
        </FormControl>
      </CardContent>
      {/*
      <CardActions className={classes.actions}>
        
      </CardActions>
      */}
    </form>
  )
}

const styles = (theme) => ({
  form: {
    //width: '100%',
    //height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  header: {
    paddingRight: theme.spacing.unit * 2 + 4,
  },
  avatar: {
    //backgroundColor: deepOrange[500],
  },
  content: {

  },
  uploadWrap: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  upload: {
    width: '300px',
    margin: `0 ${theme.spacing.unit}px 0 0`,
    padding: `${theme.spacing.unit}px 0`,
    borderBottom: `1px solid ${theme.palette.grey[600]}`,
  },
  image: {
    maxWidth: '395px',
  },
  actions: {
    justifyContent: 'flex-end',
  },
})

const setProfilePictureMutation = gql`
  mutation setProfilePicture($image: Upload!) {
    setProfilePicture(image: $image) {
      id
      url
      filename
      mimetype
    }
  }
`

export default compose(
  getContext({ snackbar: PropTypes.object }),
  withStyles(styles),
  withApollo,
  graphql(setProfilePictureMutation, {
    props: ({ props, mutate }) => ({
      setProfilePicture: (image) => mutate({
        variables: { image },
        update: (proxy, { data: { setProfilePicture } }) => {
          const data = proxy.readQuery({ query: appQuery })
          data.user.image = setProfilePicture
          proxy.writeQuery({ query: appQuery, data })
        }
      }),
    }),
  }),
  withHandlers({
    onSubmit: ({ setProfilePicture }) => ({ image }) => {
      return setProfilePicture(image[0])
      .then(({ data: { setProfilePicture } }) => {
        console.log('upload success', setProfilePicture)
      })
      .catch(error => {
        throw new SubmissionError({ _error: error.message })
      })
    }
  }),
  reduxForm({
    form: 'user',
    validate: () => ({}),
  }),
)(User)

