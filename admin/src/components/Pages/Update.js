// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { compose, getContext, withHandlers, branch, renderComponent } from 'recompose'
import { connect } from 'react-redux'
import { change, submit, reset, isDirty } from 'redux-form'
import { withApollo } from 'react-apollo'
import { query } from 'react-apollo/query-hoc'
import { withRouter } from 'react-router'
import { Trans } from '@lingui/react'

import Button from 'material-ui/Button'
import {
  Body,
  Header,
  Footer,
  Content,
  LanguageSwitcher,
  UserIcon,
  ErrorView,
  LoadingView,
  NotFoundView,
} from 'components/ux'

import Form from './Form'
import Editor, { getContent } from './Editor'

import updatePageMutation from './mutations/updatePage.graphql'
import pageQuery from './queries/page.graphql'

const UpdatePage = (props) => {
  const { data, isFormDirty, updatePage, setEditorState, submitForm } = props
  const { page: { id, title, slug, content } } = data
  const initialValues = {
    id,
    title,
    slug,
    content: JSON.parse(content),
  }
  return (
    <Body>
      <Header title={<Trans>Edit Page</Trans>}>
        <LanguageSwitcher />
        <UserIcon />
      </Header>
      <Content fluid plain withFooter>
        <Form
          form={'updatePage'}
          onSubmit={updatePage}
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
  query(pageQuery, {
    options: ({ match }) => ({
      variables: { id: match.params.id },
    }),
  }),
  branch(
    ({ data }) => data.loading,
    renderComponent(LoadingView),
  ),
  branch(
    ({ data }) => data.error,
    renderComponent(ErrorView),
  ),
  branch(
    ({ data }) => !data.page,
    renderComponent(NotFoundView),
  ),
  getContext({
    dialog: PropTypes.object,
    snackbar: PropTypes.object,
  }),
  connect(
    (state, props) => ({
      isFormDirty: isDirty('updatePage')(state),
    }),
    (dispatch, props) => ({
      submitForm: () => dispatch(submit('updatePage')),
      resetForm: () => dispatch(reset('updatePage')),
      changeField: (field, value) => dispatch(change('updatePage', field, value)),
    }),
  ),
  withApollo,
  withRouter,
  withHandlers({
    setEditorState: ({ changeField }) => (state) => {
      changeField('content', state)
    },
    updatePage: ({ client, snackbar, history, dialog, resetForm }) => (fields) => {
      const { id, title, slug } = fields
      const content = getContent(fields.content)
      return client
        .mutate({
          mutation: updatePageMutation,
          variables: { id, data: { title, slug, content } },
        })
        .then(({ data: { updatePage } }) => {
          snackbar.show(<Trans>Page updated</Trans>)
          resetForm()
        })
        .catch(error => {
          dialog.show(<Trans>Error</Trans>, error.message)
        })
    },
  })
)(UpdatePage)
