import React from 'react'
import ReactDOM from 'react-dom'
import { Piano, MidiNumbers } from 'react-piano'
import 'react-piano/dist/styles.css'
import OSMD from './OpenSheetMusicDisplay'
import SoundfontProvider from '../vendor/SoundfontProvider'

const musicfiles = require('./musicxml.json')
import { pitchToMidiNumber, checkNotes } from './utils'
import getConfig from './config'
import withSheet from './withSheet'

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net'

const config = getConfig({ keyboard: 'colemak' })

const _chain = (f1, f2) => a => {
  f1(a)
  f2(a)
}

const MyPiano = ({ keyUp, keyDown, activeNotes }) => {
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
        instrumentName="acoustic_grand_piano"
        audioContext={audioContext}
        hostname={soundfontHostname}
        render={({ isLoading, playNote, stopNote }) => (
          <Piano
            noteRange={{
              first: config.firstNote,
              last: config.lastNote,
            }}
            playNote={_chain(keyDown, playNote)}
            stopNote={_chain(keyUp, stopNote)}
            disabled={isLoading}
            width={width}
            keyboardShortcuts={config.keyboardShortcuts}
            renderNoteLabel={renderNoteLabel}
            activeNotes={activeNotes}
          />
        )}
      />
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    // Don't call this.setState() here!
    this.state = { file: musicfiles[1], pressedNotes: {} }
  }

  handleChange = (event) => {
    const file = event.target.value
    this.setState({ file })
  }

  setCursor = (cursor, getCursorNotes) => {
    this.osmd_cursor = cursor
    this.getCursorNotes = getCursorNotes
    // [35, 34, 33, 34].forEach( (activeNotes, i) => {
    //   if (! Array.isArray(activeNotes)) {
    //     activeNotes = [activeNotes]
    //   }
    //   setTimeout(() => console.log('set', i,activeNotes) || this.setState({activeNotes}), (i+1)*1000)
    //   setTimeout(() => console.log('unset', i,activeNotes) || this.setState({activeNotes:null}), (i+1)*1000+500)
    // })
  }

  keyDown = (note) => {
    const { pressedNotes } = this.state
    pressedNotes[note] = true
    const targetedNotes = this.getCursorNotes()
      .map(pitchToMidiNumber)
      .filter((n) => n > 30)
    if (checkNotes(pressedNotes, targetedNotes)) {
      this.osmd_cursor.next()
    }
    this.setState({ pressedNotes })
  }

  keyUp = (note) => {
    const { pressedNotes } = this.state
    delete pressedNotes[note]
    this.setState({ pressedNotes })
    const targetedNotes = this.getCursorNotes()
      .map(pitchToMidiNumber)
      .filter((n) => n > 30)
    if (!targetedNotes.length) {
      this.osmd_cursor.next()
    }
  }

  render() {
    return (
      <div className="App">
        <select onChange={this.handleChange}>
          {musicfiles.map((f) => (
            <option value={f} key={f}>
              {f}
            </option>
          ))}
        </select>
        <MyPiano
          keyDown={this.keyDown}
          keyUp={this.keyUp}
          activeNotes={this.state.activeNotes}
        />
        <OSMD
          file={'./musicxml/' + this.state.file}
          setCursor={this.setCursor}
        />
      </div>
    )
  }
}

App = withSheet(App)

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
