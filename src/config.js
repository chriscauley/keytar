import globalHook from '../vendor/use-global-hook'
import React from 'react'
import { KeyboardShortcuts, MidiNumbers } from 'react-piano'

const getInitialState = () => {
  return {
    keyboard: 'colemak',
    noteCount: 17,
    fromNote: 'c1',
  }
}

const deriveProps = ({ keyboard, noteCount, fromNote }) => {
  const firstNote = MidiNumbers.fromNote(fromNote)
  const lastNote = firstNote + noteCount
  let keyboardConfig = KeyboardShortcuts.HOME_ROW

  if (keyboard === 'colemak') {
    const colemak_top = 'qwfpgjluy;[]'
    const colemak_mid = "arstdhneio'"

    keyboardConfig = colemak_mid.split('').map((key, i) => ({
      natural: key,
      flat: colemak_top[i],
      sharp: colemak_top[i + 1],
    }))
  }

  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote,
    lastNote,
    keyboardConfig,
  })
  return { firstNote, lastNote, keyboardShortcuts }
}

const actions = {}

const makeHook = globalHook(React, getInitialState(), actions)

export const withConfig = (Component, { propName = 'config' } = {}) => (
  props,
) => {
  const [state, actions] = makeHook()
  props = {
    ...props,
    [propName]: {
      ...deriveProps(state),
      ...state,
      ...actions,
    },
  }
  return <Component {...props} />
}