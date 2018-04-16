// @flow

import React, { Fragment } from 'react'
import { compose, withStateHandlers } from 'recompose'
import { Trans } from '@lingui/react'

import { HTMLRenderer } from 'ory-editor-renderer'
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
import container from './container'
import './container/index.css'

import { Body, Header, LanguageSwitcher, UserIcon } from 'components/ux'

import content from './content'

const plugins = {
  content: [slate(), spacer, image, video, divider, html5video],
  layout: [
    container({ defaultPlugin: slate() }),
    parallax({ defaultPlugin: slate() }),
  ],
  native,
}

const editor = new Editor({
  plugins,
  editables: [content],
})

const getContent = (state) => {
  const json = JSON.stringify(state);
  const search = '"type":"paragraph"';
  const fix = '"type":"PARAGRAPH/PARAGRAPH"';
  const content = json.replace(new RegExp(search, 'g'), fix);
  console.log(`export default ${content}`)
  return JSON.parse(content)
}

type Props = {
  preview: boolean,
  togglePreview: Function,
  handleEditableChange: Function,
}

const PresetEditor = ({ preview, ...props }: Props) => {
  return (
    <Body style={{paddingBottom: 100}}>
      <Header title={<Trans>Editor</Trans>} onClick={props.togglePreview}>
        <LanguageSwitcher />
        <UserIcon />
      </Header>
      {preview
        ? <HTMLRenderer state={preview} plugins={plugins} />
        : <Fragment>
            <Editable
              editor={editor}
              id={content.id}
              onChange={props.handleEditableChange}
            />
            <Trash editor={editor} />
            <DisplayModeToggle editor={editor} />
            <Toolbar editor={editor} />
          </Fragment>
      }
    </Body>
  )
}

export default compose(
  withStateHandlers(
    ({
      preview = false,
      editorState = null,
    }) => ({
      preview,
      editorState,
    }),
    {
      togglePreview: ({ editorState, preview }) => () => ({
        preview: preview ? false : getContent(editorState),
      }),
      handleEditableChange: () => (state) => ({
        editorState: state,
      }),
    }
  ),
)(PresetEditor)
