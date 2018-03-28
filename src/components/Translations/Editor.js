// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { SubmissionError } from 'redux-form'
import { Query } from 'react-apollo'
import { mutation } from 'react-apollo/mutation-hoc'
import { Trans, withI18n } from '@lingui/react'

import { Error, Spinner } from 'components/ux'
import Form from './Form'

import updateTranslationsMutation from './updateTranslations.graphql'
import formQuery from './Form.graphql'
import messages from './messages'

type Props = {
  i18n: Object,
  match: Object,
  onSubmit: Function,
}

const prepareTranslations = (ns, data) => {
  const editors = {}
  const values = {}
  
  data.translations.forEach(translation => {
    const { ns, key, value, editor } = translation
    if (editor) {
      editors[`${ns}.${key}`] = editor
    }
    if (!values[ns]) {
      values[ns] = {}
    }
    values[ns][key] = value
  })
  
  const keys = messages
    .filter(m => m.split('.')[0] === ns)
    .map(m => ({ id: m, editor: editors[m] }))

  return { keys, values }
}

const TranslationEditor = (props: Props) => {
  const { i18n, match } = props
  const lang = i18n.language
  const ns = match.params.ns
  return (
    <Query query={formQuery} variables={{ lang, ns }}>
      {({ error, loading, data }) => {
        if (error) {
          return <Error>{error.message}</Error>
        }
        if (loading) {
          return <Spinner />
        }
        const { keys, values } = prepareTranslations(ns, data)
        return (
          <Form
            onSubmit={props.onSubmit}
            initialValues={values}
            keys={keys}
          />
        )
      }}
    </Query>
  )
}

export default compose(
  getContext({
    snackbar: PropTypes.object,
  }),
  withI18n(),
  mutation(updateTranslationsMutation, {
    props: ({ props, mutate }) => ({
      saveTranslations: (language, messages) =>
        mutate({
          variables: { language, messages },
        }),
    }),
  }),
  withHandlers({
    onSubmit: (props) => (data) => {
      const { i18n, snackbar, saveTranslations } = props
      /*
      const messages = {}
      for (let ns of Object.keys(data)) {
        for (let id of Object.keys(data[ns])) {
          messages[`${ns}.${id}`] = data[ns][id]
        }
      }
      */
      return saveTranslations(i18n.language, data)
        .then(({ data: { saveTranslations } }) => {
          snackbar.show(<Trans>Done</Trans>)
        })
        .catch(error => {
          throw new SubmissionError({ _error: error.message })
        })
    },
  }),
)(TranslationEditor)
