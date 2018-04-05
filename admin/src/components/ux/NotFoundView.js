// @flow

import React from 'react'
import { Trans } from '@lingui/react'

import { Body, Header, Error } from 'components/ux'

const NotFoundView = ({ error }: any) => (
  <Body>
    <Header title={''} />
    <Error>
      <Trans>Not found</Trans>
    </Error>
  </Body>
)

export default NotFoundView
