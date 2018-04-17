// @flow

import React, { Fragment } from 'react'
import { lifecycle } from 'recompose'

import Editor, { Editable } from 'ory-editor-core'
import 'ory-editor-core/lib/index.css'
import { Trash, DisplayModeToggle, Toolbar } from 'ory-editor-ui'
import 'ory-editor-ui/lib/index.css'
import slate from 'ory-editor-plugins-slate'
import 'ory-editor-plugins-slate/lib/index.css'
import image from 'ory-editor-plugins-image'
import 'ory-editor-plugins-image/lib/index.css'
import video from 'ory-editor-plugins-video'
import 'ory-editor-plugins-video/lib/index.css'
import spacer from 'ory-editor-plugins-spacer'
import 'ory-editor-plugins-spacer/lib/index.css'
import parallax from 'ory-editor-plugins-parallax-background'
import 'ory-editor-plugins-parallax-background/lib/index.css'
import html5video from 'ory-editor-plugins-html5-video'
import 'ory-editor-plugins-html5-video/lib/index.css'
import native from 'ory-editor-plugins-default-native'
import divider from 'ory-editor-plugins-divider'
import container from './plugins/container'
import './plugins/container/index.css'

import './Editor.css'

export const plugins = {
  content: [slate(), spacer, image, video, divider, html5video],
  layout: [
    container({ defaultPlugin: slate() }),
    parallax({ defaultPlugin: slate() }),
  ],
  native,
}

const editor = new Editor({
  plugins,
  editables: [],
})

export const getContent = (state: any) => {
  const json = JSON.stringify(state);
  const search = '"type":"paragraph"';
  const fix = '"type":"PARAGRAPH/PARAGRAPH"';
  const content = json.replace(new RegExp(search, 'g'), fix);
  return JSON.parse(content)
}

const PresetEditor = ({ content, page, onChange }: any) => {
  return (
    <Fragment>
      <Editable
        editor={editor}
        id={content.id}
        onChange={onChange}
      />
      <Trash editor={editor} />
      <DisplayModeToggle editor={editor} />
      <Toolbar editor={editor} />
    </Fragment>
  )
}

export default lifecycle({
  componentWillMount() {
    editor.trigger.editable.update(this.props.content)
  },
})(PresetEditor)
