import React from 'react'
import ReactDOM from 'react-dom'
import OSMD from './vendor/OpenSheetMusicDisplay'
import SoundfontProvider from './vendor/SoundfontProvider';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';


const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const colemak_top = 'qwfpgjluy;[]'
const colemak_mid = 'arstdhneio\''

const colemak_config = colemak_mid.split('').map((key, i) => (console.log(i) || {
  natural: key,
  flat: colemak_top[i],
  sharp: colemak_top[i+1],
}))

const firstNote = MidiNumbers.fromNote('c3');
const lastNote = MidiNumbers.fromNote('f4');
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: firstNote,
  lastNote: lastNote,
//  keyboardConfig: colemak_config,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const MyPiano = () => {
  console.log(MidiNumbers)
  const renderNoteLabel = ({ midiNumber }) => (
    <div className="ReactPiano__NoteLabel ReactPiano__NoteLabel--natural">
      {MidiNumbers.getAttributes(midiNumber).note}
    </div>
  )
  const width = 600
  const height = 170

  return (
    <div style={{width, height}}>
      <SoundfontProvider
        instrumentName="acoustic_grand_piano"
        audioContext={audioContext}
        hostname={soundfontHostname}
        render={({ isLoading, playNote, stopNote }) => (
          <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={playNote}
            stopNote={stopNote}
            disabled={isLoading}
            width={width}
            keyboardShortcuts={keyboardShortcuts}
            renderNoteLabel={renderNoteLabel}
          />
        )}
      />
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { file: "MuzioClementi_SonatinaOpus36No1_Part2.xml" };
  }

  handleClick(event) {
    const file = event.target.value;
    this.setState(state => state.file = file);
  }

  render() {
    return (
      <div className="App">
        <select onChange={this.handleClick.bind(this)}>
          <option value="MuzioClementi_SonatinaOpus36No1_Part2.xml">Muzio Clementi: Sonatina Opus 36 No1 Part2</option>
          <option value="Beethoven_AnDieFerneGeliebte.xml">Beethoven: An Die FerneGeliebte</option>
        </select>
        <MyPiano />
        <OSMD file={"./musicxml/"+this.state.file}>Woot!!</OSMD>
      </div>
    );
  }
}

const domContainer = document.querySelector('#react-app');
ReactDOM.render(<App/>, domContainer);