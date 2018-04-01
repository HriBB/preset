// @flow

import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import { submit, isDirty } from 'redux-form'
import { Trans, withI18n } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'

import { Body, Header, Content, Error, Spinner } from 'components/ux'

import Form from './Form'
import translations from './translations'
import translationsQuery from './Editor.graphql'

export const messages = translations
  .reduce((obj, translation) => {
    const [ns, key] = translation.split('.')
    if (!obj[ns]) obj[ns] = {}
    if (!obj[ns][key]) obj[ns][key] = { key: translation }
    return obj
  }, {})

export const namespaces = Object.keys(messages)

const getNamespace = ({ match }) => {
  return match.params.ns || namespaces[0]
}

const Editor = ({ classes, i18n, isFormDirty, ...props }) => {
  const lang = i18n.language
  const ns = getNamespace(props)
  return (
    <Body>
      <Header title={<Trans>Translations</Trans>}>
        <IconButton component={Link} to={'/'} color={'inherit'}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Content className={classes.content}>
        <Query query={translationsQuery} variables={{ lang, ns }}>
          {({ error, loading, data }) => {
            if (error) {
              return <Error>{error.message}</Error>
            }
            if (loading) {
              return <Spinner />
            }
            data.translations.forEach(({ id, ns, key, value, editor }) => {
              messages[ns][key] = { id, key: `${ns}.${key}`, value, editor }
            })
            return (
              <Form
                key={ns}
                lang={lang}
                ns={ns}
                form={`translations${ns}`}
                initialValues={{ [ns]: messages[ns] }}
                keys={messages[ns]}
              />
            )
          }}
        </Query>
      </Content>
      <Toolbar className={classes.footer}>
        <Button
          color={'secondary'}
          variant={'raised'}
          disabled={!isFormDirty}
          onClick={props.submitForm}
        >
          <Trans>Save</Trans>
        </Button>
      </Toolbar>
    </Body>
  )
}

const styles = theme => ({
  content: {
    marginBottom: theme.spacing.unit * 7,
  },
  footer: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    //backgroundColor: theme.palette.grey[300],
    backgroundColor: '#fff',
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    //boxShadow: theme.shadows[24],
    [theme.breakpoints.up(theme.drawer.breakpoint)]: {
      left: theme.drawer.width,
    },
  },
  [theme.breakpoints.up(theme.drawer.breakpoint)]: {
    content: {
      marginBottom: theme.spacing.unit * 8,
    },
    footer: {
      left: theme.drawer.width,
    },
  },
})

export default compose(
  withStyles(styles),
  withI18n(),
  connect(
    (state, props) => ({
      isFormDirty: isDirty(`translations${getNamespace(props)}`)(state),
    }),
    (dispatch, props) => ({
      submitForm: () => dispatch(submit(`translations${getNamespace(props)}`)),
    }),
  ),
)(Editor)
