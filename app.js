import React from 'react'
import ReactDOM from 'react-dom'
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import OSMD from './OpenSheetMusicDisplay'
import SoundfontProvider from './vendor/SoundfontProvider';

import { pitchToMidiNumber, checkNotes } from './utils'

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const colemak_top = 'qwfpgjluy;[]'
const colemak_mid = 'arstdhneio\''

const colemak_config = colemak_mid.split('').map((key, i) => ({
  natural: key,
  flat: colemak_top[i],
  sharp: colemak_top[i+1],
}))

const firstNote = MidiNumbers.fromNote('c1');
const lastNote = firstNote + 17;
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: firstNote,
  lastNote: lastNote,
  keyboardConfig: colemak_config,
  // keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const DOWN = {}
const noteTracker = ((playNote, stopNote) => {
  return {
    play: (args) => playNote()
  }
})

const MyPiano = ({ keyUp, keyDown, activeNotes }) => {
  const renderNoteLabel = ({ midiNumber }) => (
    <div className="ReactPiano__NoteLabel ReactPiano__NoteLabel--natural">
      {MidiNumbers.getAttributes(midiNumber).note}
    </div>
  )
  const width = 600
  const height = 170
  const _play = callback => a => {
    keyDown(a)
    callback(a)
  }
  const _stop = callback => a => {
    keyUp(a)
    callback(a)
  }

  return (
    <div style={{width, height}}>
      <SoundfontProvider
        instrumentName="acoustic_grand_piano"
        audioContext={audioContext}
        hostname={soundfontHostname}
        render={({ isLoading, playNote, stopNote }) => (
          <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={_play(playNote)}
            stopNote={_stop(stopNote)}
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

const files = [
  "WA_Mozart_Marche_Turque_Turkish_March_fingered.mxl",
  "MuzioClementi_SonatinaOpus36No1_Part2.xml",
  "Beethoven_AnDieFerneGeliebte.xml"
]

class App extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { file: files[0], pressedNotes: {} };
  }

  handleChange = event => {
    const file = event.target.value;
    this.setState({ file });
  }

  setCursor = (cursor, getCursorNotes) => {
    this.osmd_cursor = cursor
    this.getCursorNotes = getCursorNotes;
    // [35, 34, 33, 34].forEach( (activeNotes, i) => {
    //   if (! Array.isArray(activeNotes)) {
    //     activeNotes = [activeNotes]
    //   }
    //   setTimeout(() => console.log('set', i,activeNotes) || this.setState({activeNotes}), (i+1)*1000)
    //   setTimeout(() => console.log('unset', i,activeNotes) || this.setState({activeNotes:null}), (i+1)*1000+500)
    // })
  }

  keyDown = note => {
    const { pressedNotes } = this.state
    pressedNotes[note] = true;
    const targetedNotes = this.getCursorNotes().map(pitchToMidiNumber).filter(n => n > 30)
    if (checkNotes(pressedNotes, targetedNotes)) {
      this.osmd_cursor.next()
    }
    this.setState({ pressedNotes })
  }

  keyUp = note => {
    const { pressedNotes } = this.state
    delete pressedNotes[note]
    this.setState({ pressedNotes })
    const targetedNotes = this.getCursorNotes().map(pitchToMidiNumber).filter(n => n > 30)
    if (!targetedNotes.length) {
      this.osmd_cursor.next()
    }
  }

  render() {
    return (
      <div className="App">
        <select onChange={this.handleChange}>
          {files.map( f => (
            <option value={f} key={f}>{f}</option>
          ))}
        </select>
        <MyPiano keyDown={this.keyDown} keyUp={this.keyUp} activeNotes={this.state.activeNotes} />
        <OSMD file={"./musicxml/"+this.state.file} setCursor={this.setCursor}/>
      </div>
    );
  }
}

const domContainer = document.querySelector('#react-app');
ReactDOM.render(<App/>, domContainer);