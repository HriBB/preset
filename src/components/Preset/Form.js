// @flow

import React, { Fragment } from 'react'
import { compose } from 'recompose'
import { Form, Field, reduxForm } from 'redux-form'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import { CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'

import { getFieldType } from './utils'
import { getField } from 'components/Form'

const PresetForm = props => {
  const { classes, handleSubmit, initialValues, model, button } = props
  return (
    <Fragment>
      <CardContent className={classes.content}>
        <Form onSubmit={handleSubmit}>
          {model.fields.filter(f => f.name !== 'id').map(f => (
            <div key={f.name}>
              <Field
                component={getField(getFieldType(f))}
                className={classes.field}
                name={f.name}
                label={<Trans id={f.name} />}
              />
              {f.name === 'image' &&
                initialValues.image && (
                  <img
                    className={classes.image}
                    src={initialValues.image.url}
                    alt={initialValues.image.filename}
                  />
                )}
            </div>
          ))}
        </Form>
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
  content: {
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 3,
    },
  },
  field: {
    width: '100%',
    marginBottom: theme.spacing.unit * 2,
  },
  image: {
    maxWidth: '150px',
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
          return (errors[name] = <Trans>Required</Trans>)
        }
        break
      case 'Textarea':
        if (required && !fields[name]) {
          return (errors[name] = <Trans>Required</Trans>)
        }
        break
      case 'Checkbox':
        if (required && !fields.hasOwnProperty(name)) {
          return (errors[name] = <Trans>Required</Trans>)
        }
        break
      default:
        break
    }
  })
  return errors
}

export default compose(
  withStyles(styles),
  reduxForm({ validate }),
)(PresetForm)
