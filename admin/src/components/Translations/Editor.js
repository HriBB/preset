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
  lang: string,
  ns: string,
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

const TranslationEditor = ({ lang, ns, onSubmit }: Props) => {
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
            onSubmit={onSubmit}
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
      updateTranslations: (lang, messages) =>
        mutate({
          variables: { lang, messages },
        }),
    }),
  }),
  withHandlers({
    onSubmit: ({ i18n, snackbar, updateTranslations }) => (data) =>
      updateTranslations(i18n.language, data)
        .then(({ data: { updateTranslations } }) =>
          snackbar.show(<Trans>Done</Trans>)
        )
        .catch(error => {
          throw new SubmissionError({ _error: error.message })
        }),
  }),
)(TranslationEditor)
