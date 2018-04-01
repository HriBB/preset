// @flow

import React from 'react'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'

import { Body, Header, Error } from 'components/ux'

const NotFound = (props) => {
  return (
    <Body>
      <Header title={<Trans>Error</Trans>} />
      <Error><Trans>Page not found.</Trans></Error>
    </Body>
  )
}

const styles = theme => ({
})

export default withStyles(styles)(NotFound)
