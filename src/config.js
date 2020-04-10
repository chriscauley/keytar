import globalHook from '../vendor/use-global-hook'
import React from 'react'
import { KeyboardShortcuts, MidiNumbers } from 'react-piano'
import { range } from 'lodash'
import css from './css'

import Form from './Form'

const STORAGE_KEY = 'game-config'

const getInitialState = () => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
  return {
    keyboard: 'colemak',
    noteCount: 17,
    fromNote: 'C1',
    ...saved,
  }
}

const notes = []
const fundamental_notes = []
const flats = 'ABDEG'.split('')

range(9).forEach((octave) => {
  'ABCDEFG'.split('').map((note) => {
    if (flats.includes(note)) {
      notes.push(`${note}b${octave}`)
    }
    fundamental_notes.push(`${note}${octave}`)
    notes.push(`${note}${octave}`)
  })
})

const schema = {
  type: 'object',
  properties: {
    keyboard: {
      title: 'Keyboard',
      type: 'string',
      enum: ['qwerty', 'colemak'],
    },
    noteCount: {
      title: 'Number of Keys',
      type: 'integer',
      enum: range(8, 88),
    },
    fromNote: {
      title: 'First Note',
      enum: fundamental_notes,
      type: 'string',
    },
  },
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

const actions = {
  saveConfig: (store, state) => {
    store.setState(state)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.state))
  },
}

const makeHook = globalHook(React, getInitialState(), actions)

export const withConfig = (Component, { propName = 'config' } = {}) => (
  props,
) => {
  const [state, actions] = makeHook()
  props = {
    ...props,
    [propName]: {
      state,
      ...deriveProps(state),
      ...state,
      ...actions,
    },
  }
  return <Component {...props} />
}

class BaseConfigForm extends React.Component {
  render() {
    const { outer, mask, content } = css.modal
    const { state, saveConfig } = this.props.config
    return (
      <div className={outer}>
        <a href="#" className={mask}></a>
        <div className={content}>
          <Form
            schema={schema}
            formData={state}
            initial={getInitialState()}
            onSubmit={saveConfig}
          />
        </div>
      </div>
    )
  }
}

export const ConfigForm = withConfig(BaseConfigForm)
