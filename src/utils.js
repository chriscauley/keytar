import { pick } from 'lodash'
import { Pitch } from 'opensheetmusicdisplay'
import { MidiNumbers } from 'react-piano'

// see AccidentalEnum in opensheetumusicdisplay/src/Common/DataObjects/Pitch.ts
const REVERSE_ACCIDENTAL = [1, -1, 0, 0, 2, -2, 3, -3, 4, -4]

// see NoteEnum in opensheetumusicdisplay/src/Common/DataObjects/Pitch.ts

const midiNumberToString = (number) => MidiNumbers.getAttributes(number).note

const pitchToString = ({ fundamentalNote, accidental, octave }) => {
  return (
    Pitch.getNoteEnumString(fundamentalNote) +
    (Pitch.accidentalVexflow(accidental) || '') +
    octave
  )
}

export const pitchToNote = (pitch) => {
  const note = pick(pitch, ['fundamentalNote', 'accidental', 'octave'])
  note.midiNumber = pitchToMidiNumber(note)
  note.name = pitchToString(note)
  return note
}

export const offsets = {
  midi: 0,
  octave: 1,
  get: () => offsets.midi + offsets.octave * 12,
}

window.NOTE_LIB = {}

export const pitchToMidiNumber = (pitch) => {
  return (
    pitch.fundamentalNote +
    REVERSE_ACCIDENTAL[pitch.accidental] +
    pitch.octave * 12 +
    offsets.get()
  )
}

export const checkNotes = (pressedNotes, targetedNotes) => {
  const missing = !!targetedNotes.find((n) => !pressedNotes[n])
  return !missing && targetedNotes.length === Object.keys(pressedNotes).length
}

export default {
  pitch: {
    toString: pitchToString,
    toMidiNumber: pitchToMidiNumber,
  },
  midiNumber: {
    toString: midiNumberToString,
  },
}
