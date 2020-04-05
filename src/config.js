import { KeyboardShortcuts, MidiNumbers } from 'react-piano'

export default ({ keyboard, noteCount = 17, fromNote = 'c1' } = {}) => {
  const firstNote = MidiNumbers.fromNote(fromNote)
  const lastNote = firstNote + noteCount
  let keyboardConfig = KeyboardShortcuts.HOME_ROW

  if (keyboard === 'colemak') {
    const colemak_top = 'qwfpgjluy;[]'
    const colemak_mid = "arstdhneio'"

    keyboardConfig = colemak_mid.split('').map((key, i) => ({
      natural: key,
      flat: colemak_top[i],
      sharp: colemak_top[i + 1],
    }))
  }

  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote,
    lastNote,
    keyboardConfig,
  })
  return { firstNote, lastNote, keyboardShortcuts }
}
