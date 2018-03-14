// @flow weak

import React from 'react'
import { render } from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { I18nProvider } from '@lingui/react'
import { MuiThemeProvider } from 'material-ui/styles'
import JssProvider from 'react-jss/lib/JssProvider'

import en from 'locale/si/messages'
import si from 'locale/si/messages'
import client from 'apollo'
import createStore from 'store'
import getContext from 'styles'
import App from 'components/App'

const store = createStore()

const {
  jss,
  generateClassName,
  sheetsRegistry,
  sheetsManager,
  theme,
} = getContext()

const jssProps = {
  registry: sheetsRegistry,
  generateClassName,
  jss,
}

const root = document.getElementById('root')

if (root) {
  render(
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <I18nProvider language={'si'} catalogs={{ en, si }}>
          <JssProvider {...jssProps}>
            <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
              <Router>
                <Route component={App} />
              </Router>
            </MuiThemeProvider>
          </JssProvider>
        </I18nProvider>
      </ApolloProvider>
    </ReduxProvider>,
    root
  )
}
