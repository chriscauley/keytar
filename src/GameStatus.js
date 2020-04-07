import React from 'react'

import { pitchToNote } from './utils'
import withSheet from './withSheet'

const css = {
  wrapper: "top-0 right-0 fixed border-double border-4 border-gray-600 px-2 py-1"
}

class GameStatus extends React.Component {
  render() {
    if (this.props.sheet.loading) {
      return null
    }
    const currentNotes = this.props.sheet.getCurrentNotes().map(pitchToNote)
    return (
      <div className={css.wrapper}>
        Yay!
        <div className="current">
          {currentNotes.map((note) => (
            <div key={note.midiNumber}>
              {note.name} {note.midiNumber}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default withSheet(GameStatus)
