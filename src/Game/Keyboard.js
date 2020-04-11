import React from 'react'
import { Piano, MidiNumbers } from 'react-piano'
import 'react-piano/dist/styles.css'

import SoundfontProvider from '../../vendor/SoundfontProvider'
import withSheet from '../withSheet'
import { withConfig } from '../config'

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net'

const _chain = (f1, f2) => (a) => {
  f1(a)
  f2(a)
}

function Keyboard({ activeNotes, config, sheet }) {
  // # TODO activeNotes got unplugged
  const { keyUp, keyDown } = sheet
  const { firstNote, lastNote, keyboardShortcuts } = config
  const renderNoteLabel = ({ midiNumber }) => (
    <div className="ReactPiano__NoteLabel ReactPiano__NoteLabel--natural">
      {MidiNumbers.getAttributes(midiNumber).note}
    </div>
  )
  const width = 600
  const height = 170
  return (
    <div style={{ width, height }}>
      <SoundfontProvider
        TODO={
          'this is inefficient because it reloads 2.5MB sound file every navigation'
        }
        instrumentName="acoustic_grand_piano"
        audioContext={audioContext}
        hostname={soundfontHostname}
        render={({ isLoading, playNote, stopNote }) => (
          <Piano
            noteRange={{
              first: firstNote,
              last: lastNote,
            }}
            playNote={_chain(keyDown, playNote)}
            stopNote={_chain(keyUp, stopNote)}
            disabled={isLoading}
            width={width}
            keyboardShortcuts={keyboardShortcuts}
            renderNoteLabel={renderNoteLabel}
            activeNotes={activeNotes}
          />
        )}
      />
    </div>
  )
}

export default withSheet(withConfig(Keyboard))
