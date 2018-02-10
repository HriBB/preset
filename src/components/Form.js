// @flow

import React, { Fragment } from 'react'
import { compose } from 'recompose'
import { Field, reduxForm } from 'redux-form'

import { withStyles } from 'material-ui/styles'
import { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'

import { getTypeFormFields } from './utils'
import { getFormField } from './form'

const Form = (props) => {
  const { classes, handleSubmit, type } = props
  const fields = getTypeFormFields(type)
  console.log(fields)
  return (
    <Fragment>
      <CardContent style={{padding:'20px 4px'}}>
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
        <Button color={'primary'} variant={'raised'} onClick={handleSubmit}>Save</Button>
      </CardActions>
    </Fragment>
  )
}

const styleSheet = (theme) => ({
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

