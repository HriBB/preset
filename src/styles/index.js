// @flow weak

import { create } from 'jss'
import preset from 'jss-preset-default'
import extend from 'jss-extend'
import { SheetsRegistry } from 'react-jss'
import createMuiTheme from 'material-ui/styles/createMuiTheme'
import createGenerateClassName from 'material-ui/styles/createGenerateClassName'
import primary from 'material-ui/colors/blue'
import secondary from 'material-ui/colors/pink'

const theme = createMuiTheme({
  palette: {
    primary,
    secondary,
    type: 'light',
  },
  drawer: {
    breakpoint: 'md',
    width: 300,
  },
  tree: {
    itemHeight: 48,
  },
})

// Configure JSS
const jss = create({ plugins: [ ...preset().plugins, extend() ] })
jss.options.createGenerateClassName = createGenerateClassName

export default function getContext() {
  return {
    jss,
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
  }
}
