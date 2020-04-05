import React from 'react'
import globalHook from './vendor/use-global-hook'
import { pitchToMidiNumber } from './utils'

const _globals = {}

const actions = {
  set: (store, sheet) => {
    setTimeout( () => {
      _globals.sheet = sheet
      const { cursor } = sheet
      const notes = []
      for (var i=0;i<3; i++) {
        notes.push(
          cursor.NotesUnderCursor().map(n => n.pitch).filter(Boolean).map(pitchToMidiNumber)
        )
        cursor.next()
        if (cursor.iterator.endReached) {
          break
        }
      }
      cursor.reset()
      sheet.render()
      cursor.show()
      return notes
    }, 0)
  },
}


const makeHook = globalHook(React, { }, actions)

export default (Component, {propName='sheet'}={}) => props => {
  propName = propName || 'sheet'
  const [state, actions] = makeHook()
  props= {
    ...props,
    [propName]: {
      ...state,
      ...actions,
      ..._globals,
    }
  }
  return <Component {...props} />
}