// @flow

import React, { Fragment } from 'react'
import { compose, withHandlers } from 'recompose'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { graphql, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'
import CloseIcon from 'material-ui-icons/Close'
import Typography from 'material-ui/Typography'

import { Upload } from 'components/form'

const User = (props) => {
  const { classes, error, handleSubmit } = props
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <CardHeader
        className={classes.header}
        avatar={
          <Avatar aria-label={'User'} className={classes.avatar}>
            {'U'}
          </Avatar>
        }
        action={
          <IconButton component={Link} to={`/`}>
            <CloseIcon />
          </IconButton>
        }
        title={'User'}
      />
      <CardContent className={classes.content}>
        <Field
          component={Upload}
          className={classes.field}
          name={'image'}
          label={'Image'}
        />
        <FormControl error className={classes.error}>
          <FormHelperText>{error || '\u00A0'}</FormHelperText>
        </FormControl>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button color={'primary'} type={'submit'} variant={'raised'}>
          {'Submit'}
        </Button>
      </CardActions>
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
  field: {
    //border: '1px solid red',
    width: '100%',
    marginBottom: theme.spacing.unit * 2,
  },
  actions: {
    justifyContent: 'flex-end',
  },
})

const setProfilePictureMutation = gql`
  mutation setProfilePicture($image: Upload!) {
    login(image: $image) {
      id
      url
      path
      filename
      mimetype
      encoding
    }
  }
`

export default compose(
  withStyles(styles),
  withApollo,
  graphql(setProfilePictureMutation, {
    props: ({ ownProps, mutate }) => ({
      setProfilePicture: (image) => mutate({
        variables: { image },
      }),
    }),
  }),
  withHandlers({
    onSubmit: ({ setProfilePicture }) => ({ image }) => {
      console.log('onSubmit', image)
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

