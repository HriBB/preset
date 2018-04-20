// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { branch, compose, getContext, renderComponent } from 'recompose'
import { withApollo } from 'react-apollo'
import { query } from 'react-apollo/query-hoc'
import { Trans } from '@lingui/react'

import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import { Body, Header, Content, ErrorView, LoadingView } from 'components/ux'

import deployQuery from './deployQuery.graphql'
import deployMutation from './deployMutation.graphql'
import deploySubscription from './deploySubscription.graphql'

type Props = {
  classes: Object,
  client: any,
  data: Object,
  snackbar: Object,
  dialog: Object,
  data: Object,
  deploy: Function,
}

type State = {
  inProgress: ?boolean,
}

class Deploy extends Component<Props, State> {

  // TODO: put in global redux
  state = {
    inProgress: undefined,
  }

  unsubscribe = null
  
  subscribe() {
    this.setState({ inProgress: true })
    if (this.unsubscribe) return
    this.unsubscribe = this.props.data.subscribeToMore({
      document: deploySubscription,
      updateQuery: (prev, { subscriptionData: { data } }) => {
        if (!data) return prev
        if (data.deploy.data === 'done' || data.deploy.data === 'error') {
          this.endDeploy()
        }
        return update(prev, { deploy: { $push: [data.deploy] } })
      },
    })
  }

  startDeploy = () => {
    const { client, snackbar, dialog } = this.props
    this.subscribe()
    client
      .mutate({ mutation: deployMutation })
      .then(({ data }) => {
        snackbar.show(<Trans>Deploy started</Trans>)
      })
      .catch(error => {
        dialog.show(<Trans>Error</Trans>, error.message)
      })
  }

  endDeploy() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe()
    }
    this.unsubscribe = null
    this.setState({ inProgress: false })
  }

  componentDidMount() {
    if (this.props.data.deploy.length > 0) {
      this.subscribe()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.data.deploy.length && this.props.data.deploy.length) {
      this.subscribe()
    }
  }

  render() {
    const { classes, data } = this.props
    const { inProgress} = this.state
    return (
      <Body>
        <Header title={<Trans>Deploy Gatsby</Trans>} />
        <Content cardClassName={classes.content}>
          <Button
            className={classes.button}
            color={'primary'}
            variant={'raised'}
            onClick={this.startDeploy}
            disabled={typeof inProgress !== 'undefined' ? inProgress : data.deploy.length > 0}
          >
            <Trans>Deploy</Trans>
          </Button>
          <div className={classes.output}>
            {data.deploy.map(item =>
              <div key={item.id}>{item.data}</div>
            )}
          </div>
        </Content>
      </Body>
    )
  }
}

const styles = theme => ({
  content: {
    padding: '1rem',
  },
  output: {
    marginTop: '1rem',
    border: `1px solid ${theme.palette.grey[300]}`,
    background: theme.palette.grey[100],
    color: theme.palette.grey[700],
    padding: '1rem',
    fontSize: '0.875rem',
    fontFamily: 'Courier New',
    height: '70vh',
    overflow: 'auto',
    [theme.breakpoints.up('sm')]: {
      height: '75vh',
    },
  },
})

export default compose(
  query(deployQuery),
  branch(
    ({ data }) => data.loading,
    renderComponent(LoadingView),
  ),
  branch(
    ({ data }) => data.error,
    renderComponent(ErrorView),
  ),
  withApollo,
  withStyles(styles),
  getContext({
    dialog: PropTypes.object,
    snackbar: PropTypes.object,
  }),
)(Deploy)
