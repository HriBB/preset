// @flow

import gql from 'graphql-tag'

const setProfilePictureMutation = gql`
  mutation setProfilePicture($image: Upload!) {
    setProfilePicture(image: $image) {
      id
      url
      filename
      mimetype
    }
  }
`

export default setProfilePictureMutation