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

import { getTypeFormFields } from './utils'
import { getFormField } from './form'

const Form = (props) => {
  const { classes, handleSubmit, type, title, button } = props
  const fields = getTypeFormFields(type)
  return (
    <Fragment>
      <CardHeader
        avatar={
          <Avatar aria-label={'Recipe'} className={classes.avatar}>
            {type.name.substring(0,1)}
          </Avatar>
        }
        action={
          <IconButton component={Link} to={`/${type.name}`}>
            <CloseIcon />
          </IconButton>
        }
        title={title}
      />
      <CardContent className={classes.content}>
        <form onSubmit={handleSubmit}>  
          {fields.map(({ component, name, label }) =>
            <div key={name} width={300}>
              <Field
                component={getFormField(component)}
                className={classes.field}
                inputClassName={classes.input}
                name={name}
                label={label}
              />
            </div>
          )}
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

const styleSheet = (theme) => ({
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
  input: {
    //border: '1px solid green',
  },
  actions: {
    justifyContent: 'flex-end',
  },
})

export default compose(
  withStyles(styleSheet),
  reduxForm({
    validate: () => {
      return {}
    }
  }),
)(Form)

