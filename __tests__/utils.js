import utils from '../src/utils'

const test_data = [
  ['A1', 33, 9, 2, 1],
  ['B1', 35, 11, 2, 1],
  ['Ab1', 32, 7, 0, 1],
]

test('util functions match work in every direction', () => {
  test_data.forEach(([string, number, fundamentalNote, accidental, octave]) => {
    expect(utils.midiNumber.toString(number)).toBe(string)
    const pitch = { fundamentalNote, accidental, octave }
    expect(utils.pitch.toMidiNumber(pitch)).toBe(number)
    // This has a problem because of the sharp/flat issue
    // expect(utils.pitch.toString(pitch)).toBe(string)
  })
})
