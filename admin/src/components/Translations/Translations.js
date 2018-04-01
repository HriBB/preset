// @flow

import React from 'react'
import { compose } from 'recompose'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Trans, withI18n } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'

import { Body, Header, Content, Error, Spinner } from 'components/ux'

import Form from './Form'
import translations from './messages'
import translationsQuery from './Translations.graphql'

export const messages = translations
  .reduce((obj, id) => {
    const [ns, key] = id.split('.')
    if (!obj[ns]) obj[ns] = {}
    if (!obj[ns][key]) obj[ns][key] = { id }
    return obj
  }, {})

export const namespaces = Object.keys(messages)

const Translations = ({ classes, i18n, match, ...props }) => {
  const lang = i18n.language
  const ns = match.params.ns || namespaces[0]
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
            data.translations.forEach(({ ns, key, value, editor }) => {
              messages[ns][key] = { id: `${ns}.${key}`, value, editor }
            })
            return (
              <Form
                key={ns}
                form={`translations${ns}`}
                initialValues={messages}
                keys={messages[ns]}
              />
            )
          }}
        </Query>
      </Content>
      <Toolbar className={classes.footer}>
        <Button color={'secondary'} variant={'raised'}>
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
    backgroundColor: theme.palette.grey[300],
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
)(Translations)
