import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, HashRouter, Route, Link } from 'react-router-dom'
import { Piano, MidiNumbers } from 'react-piano'
import 'react-piano/dist/styles.css'
import OSMD from './OpenSheetMusicDisplay'
import SoundfontProvider from '../vendor/SoundfontProvider'

import SongPicker from './SongPicker'
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

class BaseApp extends React.Component {
  constructor(props) {
    super(props)
    // Don't call this.setState() here!
    this.state = { file: musicfiles[1], pressedNotes: {} }
  }

  render() {
    return (
      <div className="App">
        <div className="container mx-auto">
          <BrowserRouter>
            <Route exact path="/" component={SongPicker} />
            <Route path="/play/:filename" component={GameBoard} />
            <div className="fixed bottom-0 right-0 text-4xl">
              <Link to="/" className="fa fa-home p-4"></Link>
              <a href="#/docs/css" className="fa fa-paint-brush p-4"></a>
              <a href="#/config" className="fa fa-gear p-4"></a>
            </div>
          </BrowserRouter>
          <HashRouter>
            <Route path="/config" component={ConfigForm} />
            <Route path="/docs/css" component={CSSDocs} />
          </HashRouter>
        </div>
      </div>
    )
  }
}

const App = withSheet(BaseApp)

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
