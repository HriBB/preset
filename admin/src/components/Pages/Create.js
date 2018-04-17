// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { compose, withHandlers, getContext } from 'recompose'
import { connect } from 'react-redux'
import { change, submit, reset, isDirty } from 'redux-form'
import { mutation } from 'react-apollo/mutation-hoc'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router'
import { Trans, withI18n } from '@lingui/react'
import { createEmptyState } from 'ory-editor-core'

import Button from 'material-ui/Button'
import { Body, Header, Footer, Content, LanguageSwitcher, UserIcon } from 'components/ux'
import Form from './Form'
import Editor, { getContent } from './Editor'

import createPageMutation from './mutations/createPage.graphql'
import createPageUpdate from './mutations/createPageUpdate'

const emptyState = createEmptyState()

const CreatePage = (props) => {
  const { isFormDirty, createPage, setEditorState, submitForm } = props
  const initialValues = {
    title: 'New Page',
    slug: 'new-page',
    content: emptyState,
  }
  return (
    <Body>
      <Header title={<Trans>Create Page</Trans>}>
        <LanguageSwitcher />
        <UserIcon />
      </Header>
      <Content fluid plain withFooter>
        <Form
          form={'createPage'}
          onSubmit={createPage}
          initialValues={initialValues}
        />
        <Editor
          content={initialValues.content}
          onChange={setEditorState}
        />
      </Content>
      <Footer>
        <Button
          color={'secondary'}
          variant={'raised'}
          disabled={!isFormDirty}
          onClick={submitForm}
        >
          <Trans>Save</Trans>
        </Button>
      </Footer>
    </Body>
  )
}

export default compose(
  getContext({
    dialog: PropTypes.object,
    snackbar: PropTypes.object,
  }),
  connect(
    (state, props) => ({
      isFormDirty: isDirty('createPage')(state),
    }),
    (dispatch, props) => ({
      submitForm: () => dispatch(submit('createPage')),
      resetForm: () => dispatch(reset('createPage')),
      changeField: (field, value) => dispatch(change('createPage', field, value)),
    }),
  ),
  mutation(createPageMutation, {
    props: ({ props, mutate }) => ({
      updateTranslations: data =>
        mutate({
          variables: { data },
        }),
    }),
  }),
  withI18n(),
  withApollo,
  withRouter,
  withHandlers({
    setEditorState: ({ changeField }) => (state) => {
      changeField('content', state)
    },
    createPage: ({ client, dialog, history, snackbar }) => (fields) => {
      // @todo export so you can test it in isolation
      const { title, slug } = fields
      const content = getContent(fields.content)
      return client
        .mutate({
          mutation: createPageMutation,
          update: createPageUpdate(client),
          variables: { data: { title, slug, content } },
        })
        .then(({ data: { createPage } }) => {
          snackbar.show(<Trans>Page created</Trans>)
          history.push(`/pages/${createPage.id}`)
        })
        .catch(error => {
          dialog.show(<Trans>Error</Trans>, error.message)
        })
    },
  })
)(CreatePage)
