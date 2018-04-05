// @flow

export const SET_LANGUAGE = 'app/SET_LANGUAGE'

export function setLanguage(language: string) {
  return { type: SET_LANGUAGE, language }
}
