import React from 'react'

import { pitchToNote } from './utils'
import withSheet from './withSheet'

class GameStatus extends React.Component {
  render() {
    if (this.props.sheet.loading) {
      return null
    }
    const currentNotes = this.props.sheet.getCurrentNotes().map(pitchToNote)
    return (
      <div className="GameStatus">
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
