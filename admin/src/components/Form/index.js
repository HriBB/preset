// @flow

import Select from './Select'
import Text from './Text'
import Textarea from './Textarea'
import Checkbox from './Checkbox'
import Switch from './Switch'
import Upload from './Upload'

export { Select, Text, Textarea, Checkbox, Switch, Upload }

export const getField = (type: string) => {
  switch (type) {
    case 'Text':
      return Text
    case 'Textarea':
      return Textarea
    case 'Select':
      return Select
    case 'Checkbox':
      return Checkbox
    case 'Switch':
      return Switch
    case 'File':
      return Upload
    default:
      return Text
  }
}

export function getFormField(type: string) {
  switch (type) {
    case 'Text':
      return Text
    case 'Textarea':
      return Textarea
    case 'Select':
      return Select
    case 'Checkbox':
      return Checkbox
    case 'Switch':
      return Switch
    case 'File':
      return Upload
    default:
      return Text
  }
}
