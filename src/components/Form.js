// @flow

import React, { Fragment } from 'react'
import { compose } from 'recompose'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'
import { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'
import CloseIcon from 'material-ui-icons/Close'

import { getFormField } from 'components/form'

const Form = props => {
  const { classes, handleSubmit, initialValues, model, title, button } = props
  return (
    <Fragment>
      <CardHeader
        className={classes.header}
        avatar={
          <Avatar aria-label={model.label} className={classes.avatar}>
            {model.name.substring(0, 1)}
          </Avatar>
        }
        action={
          <IconButton component={Link} to={`/${model.name}`}>
            <CloseIcon />
          </IconButton>
        }
        title={title}
      />
      <CardContent className={classes.content}>
        <form onSubmit={handleSubmit}>
          {model.fields.map(({ name, label, type }) => (
            <div key={name}>
              <Field
                component={getFormField(type)}
                className={classes.field}
                name={name}
                label={label}
              />
              {name === 'image' &&
                initialValues.image && (
                  <img
                    className={classes.image}
                    src={initialValues.image.url}
                    alt={initialValues.image.filename}
                  />
                )}
            </div>
          ))}
        </form>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button color={'secondary'} variant={'raised'} onClick={handleSubmit}>
          {button}
        </Button>
      </CardActions>
    </Fragment>
  )
}

const styles = theme => ({
  header: {
    paddingRight: theme.spacing.unit * 2 + 4,
  },
  avatar: {
    //backgroundColor: deepOrange[500],
  },
  content: {},
  field: {
    //border: '1px solid red',
    width: '100%',
    marginBottom: theme.spacing.unit * 2,
  },
  image: {
    width: '395px',
  },
  actions: {
    justifyContent: 'flex-end',
  },
})

const validate = (fields, { model }) => {
  const errors = {}
  model.fields.forEach(({ name, type, required }) => {
    switch (type) {
      case 'Text':
        if (required && !fields[name]) {
          return (errors[name] = 'Required')
        }
        break
      case 'Textarea':
        if (required && !fields[name]) {
          return (errors[name] = 'Required')
        }
        break
      case 'Checkbox':
        if (required && !fields.hasOwnProperty(name)) {
          return (errors[name] = 'Required')
        }
        break
      default:
        break
    }
  })
  return errors
}

export default compose(withStyles(styles), reduxForm({ validate }))(Form)
