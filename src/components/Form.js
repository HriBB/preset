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

const Form = (props) => {
  const { classes, handleSubmit, model, title, button } = props
  return (
    <Fragment>
      <CardHeader
        className={classes.header}
        avatar={
          <Avatar aria-label={'Recipe'} className={classes.avatar}>
            {model.name.substring(0,1)}
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
          {model.fields.map(({ name, label, type }) =>
            <div key={name} width={300}>
              <Field
                component={getFormField(type)}
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

const styles = (theme) => ({
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
  input: {
    //border: '1px solid green',
  },
  actions: {
    justifyContent: 'flex-end',
  },
})

export default compose(
  withStyles(styles),
  reduxForm({
    validate: () => {
      return {}
    }
  }),
)(Form)

