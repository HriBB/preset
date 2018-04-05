// @flow

import React from 'react'
import { Trans } from '@lingui/react'

import { Body, Header, Error } from 'components/ux'

const ErrorView = ({ error }: any) => (
  <Body>
    <Header title={<Trans>Error</Trans>} />
    <Error>{error.message}</Error>
  </Body>
)

export default ErrorView
