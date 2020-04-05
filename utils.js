import { Pitch } from 'opensheetmusicdisplay'
import { MidiNumbers } from 'react-piano'

// see AccidentalEnum in opensheetumusicdisplay/src/Common/DataObjects/Pitch.ts
const REVERSE_ACCIDENTAL = [1, -1, 0, 0, 2, -2, 3, -3, 4, -4]

// see NoteEnum in opensheetumusicdisplay/src/Common/DataObjects/Pitch.ts

const numberToNote = number => MidiNumbers.getAttributes(number).note
const pitchToString = ({fundamentalNote, accidental, octave}) => {
  return Pitch.getNoteEnumString(fundamentalNote) + (Pitch.accidentalVexflow(accidental)||"") + octave
}

const MIDI_OFFSET = 0
const OCTAVE_OFFSET = 2

const OFFSET = MIDI_OFFSET + OCTAVE_OFFSET * 8

window.NOTE_LIB = {}

export const pitchToMidiNumber = pitch => {
  const number = pitch.fundamentalNote + REVERSE_ACCIDENTAL[pitch.accidental] + pitch.octave*8 + OFFSET
  const string = pitchToString(pitch)
  // TODO use NOTE_LIB as a way to generate tests
  NOTE_LIB[string] = [pitch.fundamentalNote, pitch.accidental, pitch.octave, number]
  // showNoteLib()
  return pitch.fundamentalNote + REVERSE_ACCIDENTAL[pitch.accidental] + pitch.octave*8 + OFFSET
}

export const checkNotes = (pressedNotes, targetedNotes) => {
  const missing = !! targetedNotes.find(n => !pressedNotes[n])
  console.log(pressedNotes, targetedNotes)
  return !missing && targetedNotes.length === Object.keys(pressedNotes).length
}
