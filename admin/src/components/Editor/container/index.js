// @flow weak
import React, { Component } from 'react'
import { v4 } from 'uuid'
import Icon from 'material-ui-icons/Crop169'
import type { ContentPlugin } from 'ory-editor-core/lib/service/plugin/classes'

type Props = {
  children: any,
}

class PluginComponent extends Component<Props> {
  render() {
    return (
      <div className='ory-plugins-layout-container'>
        {this.props.children}
      </div>
    )
  }
}

export default ({ defaultPlugin }: { defaultPlugin: ContentPlugin }) => ({
  Component: PluginComponent,
  name: 'preset/editor/layout/container',
  version: '0.0.1',

  text: 'Container',
  IconComponent: <Icon />,

  createInitialChildren: () => ({
    id: v4(),
    rows: [
      {
        id: v4(),
        cells: [
          {
            content: {
              plugin: defaultPlugin,
              state: defaultPlugin.createInitialState(),
            },
            id: v4(),
          },
        ],
      },
    ],
  }),
  handleFocusNextHotKey: () => Promise.reject(),
  handleFocusPreviousHotKey: () => Promise.reject(),
})
