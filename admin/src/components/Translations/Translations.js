// @flow

import React from 'react'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import { Query } from 'react-apollo'
import { submit, reset, isDirty } from 'redux-form'
import { Trans, withI18n } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'

import {
  Body,
  Header,
  Content,
  Error,
  Spinner,
  LanguageSwitcher,
  UserIcon,
} from 'components/ux'

import Form from './Form'
import translations from './keys'
import translationsQuery from './Translations.graphql'

const getMessages = (data) => {
  const messages = translations.reduce((obj, translation) => {
    // messages are in a namespace.key format
    // split all keys, and map them into object
    const [ns, key] = translation.split('.')
    if (!obj[ns]) {
      obj[ns] = {}
    }
    if (!obj[ns][key]) {
      obj[ns][key] = { key: translation, editor: 'Text' }
    }
    return obj
  }, {})
  // apply data to messages
  // @todo handle extra messages
  if (data) {
    data.forEach(({ id, lang, ns, key, value, editor }) => {
      if (messages[ns][key]) {
        Object.assign(messages[ns][key], { id, lang, value, editor })
      }
    })
  }
  return messages
}

export const messages = getMessages()
export const namespaces = Object.keys(messages)

// @todo show number of missing messages (18/24)

const Editor = ({ classes, lang, isFormDirty, match, ...props }) => {
  const ns = match.params.ns || namespaces[0]
  return (
    <Body>
      <Header title={<Trans>Translations</Trans>}>
        <LanguageSwitcher />
        <UserIcon />
      </Header>
      <Content className={classes.content}>
        <Query query={translationsQuery} variables={{ lang, ns }}>
          {({ error, loading, data }) => {
            if (error) return <Error>{error.message}</Error>
            if (loading) return <Spinner />
            const messages = getMessages(data.translations)
            return (
              <Form
                form={'translations'}
                initialValues={{ [ns]: messages[ns] }}
                lang={lang}
                ns={ns}
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
  tabs: {
    backgroundColor: theme.palette.grey[300],
    boxShadow: theme.shadows[2],
    minHeight: 'auto',
  },
  content: {
    marginBottom: theme.spacing.unit * 7,
  },
  footer: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: theme.palette.grey[200],
    //backgroundColor: '#fff',
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
  withI18n(),
  withStyles(styles),
  connect(
    (state, props) => ({
      lang: state.app.language,
      isFormDirty: isDirty('translations')(state),
    }),
    (dispatch, props) => ({
      submitForm: () => dispatch(submit('translations')),
      resetForm: () => dispatch(reset('translations')),
    }),
  ),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (this.props.lang !== prevProps.lang) {
        this.props.resetForm()
      }
    },
  }),
)(Editor)
