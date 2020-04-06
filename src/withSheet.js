import React from 'react'
import globalHook from '../vendor/use-global-hook'
import { pitchToMidiNumber, pitchToNote, checkNotes } from './utils'

const dummy_cursor = {
  next: () => {},
  NotesUnderCursor: () => [],
}

const _globals = {
  cursor: dummy_cursor,
}

const getCurrentNotes = () =>
  _globals.cursor
    .NotesUnderCursor()
    .map((n) => n.pitch)
    .filter(Boolean)
    .map(pitchToNote)

const tick = (store, stateDelta = {}) => {
  const state = {
    ...store.state,
    ...stateDelta,
  }
  const targetedNotes = getCurrentNotes()
  if (checkNotes(state.pressedNotes, targetedNotes)) {
    _globals.cursor.next()
  }
  store.setState(state)
}

const actions = {
  getCurrentNotes,
  keyDown: (store, midiNumber) => {
    const { pressedNotes } = store.state
    pressedNotes[midiNumber] = true
    tick(store, { pressedNotes })
  },
  keyUp: (store, midiNumber) => {
    const { pressedNotes } = store.state
    delete pressedNotes[midiNumber]
    tick(store, { pressedNotes })
  },
  set: (store, sheet) => {
    setTimeout(() => {
      const { cursor } = sheet
      _globals.sheet = sheet
      _globals.cursor = cursor
      const notes = []
      for (let i = 0; i < 100000; i++) {
        notes.push(
          cursor
            .NotesUnderCursor()
            .map((n) => n.pitch)
            .filter(Boolean)
            .map(pitchToMidiNumber),
        )
        cursor.next()
        if (cursor.iterator.endReached) {
          break
        }
      }
      if (!cursor.iterator.endReached) {
        console.warn('Song had more than 100k notes and was truncated')
      }
      cursor.reset()
      sheet.render()
      cursor.show()
      store.setState({ notes, loaded: true })
    }, 0)
  },
}

const makeHook = globalHook(React, { loaded: false, pressedNotes: {} }, actions)

export default (Component, { propName = 'sheet' } = {}) => (props) => {
  const [state, actions] = makeHook()
  props = {
    ...props,
    [propName]: {
      ...state,
      ...actions,
      ..._globals,
    },
  }
  return <Component {...props} />
}
