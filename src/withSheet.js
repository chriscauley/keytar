import React from 'react'
import globalHook from '../vendor/use-global-hook'
import { pitchToMidiNumber } from './utils'

const _globals = {}

const actions = {
  set: (store, sheet) => {
    setTimeout(() => {
      _globals.sheet = sheet
      const { cursor } = sheet
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
        console.warn("Song had more than 100k notes and was truncated")
      }
      cursor.reset()
      sheet.render()
      cursor.show()
      store.setState({notes, loaded: true})
    }, 0)
  },
}

const makeHook = globalHook(React, {loaded: false}, actions)

export default (Component, { propName = 'sheet' } = {}) => (props) => {
  propName = propName || 'sheet'
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
