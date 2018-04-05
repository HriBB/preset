// @flow

import update from 'immutability-helper'

import {
  SET_LANGUAGE,
} from './actions'

type State = {
  language: string,
}

const initialState: State = {
  language: 'si',
}

export default function app(state: State = initialState, action: any) {
  switch (action.type) {
    case SET_LANGUAGE:
      return update(state, { language: { $set: action.language } })
    default:
      return state
  }
}
