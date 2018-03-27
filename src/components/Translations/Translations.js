// @flow

import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import { Body, Header, Content } from 'material-ui-preset'

import List from './List'
import Form from './Form'

const Translations = ({ classes, match }) => {
  return (
    <Body>
      <Header title={<Trans>Translations</Trans>}>
        <IconButton
          component={Link}
          to={match.params.namespace ? '/translations' : '/'}
          color={'inherit'}
        >
          <CloseIcon />
        </IconButton>
      </Header>
      <Content>
        <Switch>
          <Route path={'/translations/'} exact component={List} />
          <Route path={'/translations/:namespace'} component={Form} />
        </Switch>
      </Content>
    </Body>
  )
}

const styles = theme => ({
  list: {
    //marginTop: theme.spacing.unit * 2,
  },
})

export default withStyles(styles)(Translations)
