import React from 'react'
import { Piano, MidiNumbers } from 'react-piano'
import 'react-piano/dist/styles.css'
import OSMD from './OpenSheetMusicDisplay'
import SoundfontProvider from '../vendor/SoundfontProvider'

import withSheet from './withSheet'
import GameStatus from './GameStatus'
import { withConfig } from './config'

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net'

const _chain = (f1, f2) => (a) => {
  f1(a)
  f2(a)
}

const MyPiano = withSheet(
  withConfig((props) => {
    // # TODO activeNotes got unplugged
    const { activeNotes, config, sheet } = props
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
  }),
)

const GameBoard = (props) => {
  const { filename } = props.match.params
  return (
    <div>
      <GameStatus />
      <MyPiano />
      <OSMD file={'/musicxml/' + filename} />
    </div>
  )
}

export default GameBoard
