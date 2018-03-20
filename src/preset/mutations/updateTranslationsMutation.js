// @flow

import gql from 'graphql-tag'

const updateTranslationsMutation = gql`
  mutation setProfilePicture($language: String!, $messages: JSON!) {
    updateTranslations(language: $language, messages: $messages)
  }
`

export default updateTranslationsMutation
