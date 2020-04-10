import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import { Piano, MidiNumbers } from 'react-piano'
import 'react-piano/dist/styles.css'
import OSMD from './OpenSheetMusicDisplay'
import SoundfontProvider from '../vendor/SoundfontProvider'

const musicfiles = require('./musicxml.json')
import withSheet from './withSheet'
import { withConfig, ConfigForm } from './config'
import GameStatus from './GameStatus'
import CSSDocs from './css/docs'

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net'

const _chain = (f1, f2) => (a) => {
  f1(a)
  f2(a)
}

const MyPiano = withSheet(
  withConfig((props) => {
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

class BaseApp extends React.Component {
  constructor(props) {
    super(props)
    // Don't call this.setState() here!
    this.state = { file: musicfiles[1], pressedNotes: {} }
  }

  handleChange = (event) => {
    const file = event.target.value
    this.setState({ file })
  }

  render() {
    return (
      <div className="App">
        <GameStatus />
        <div className="container mx-auto">
          <select onChange={this.handleChange} value={this.state.file}>
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
          <HashRouter>
            <Route path="/config" component={ConfigForm} />
            <Route path="/docs/css" component={CSSDocs} />
          </HashRouter>
        </div>
        <div className="fixed bottom-0 right-0 text-4xl">
          <a href="#/docs/css" className="fa fa-paint-brush p-4"></a>
          <a href="#/config" className="fa fa-gear p-4"></a>
        </div>
      </div>
    )
  }
}

const App = withSheet(BaseApp)

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
