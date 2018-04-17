// @flow

import React from 'react'
import { Trans } from '@lingui/react'

import { Body, Header, Error } from 'components/ux'

const ErrorView = ({ error, data }: any) => (
  <Body>
    <Header title={<Trans>Error</Trans>} />
    <Error>{data && data.error ? data.error.message : error.message ? error.message : error}</Error>
  </Body>
)

export default ErrorView
