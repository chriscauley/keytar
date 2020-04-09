import CSS from '../src/css/CSS'

const _test = (answer, ...tests) => tests.forEach(question => expect(answer).toBe(question))

test('CSS', () => {
  const btn = CSS({
    __base: "btn",
    __default: "primary",
    primary: "btn-primary",
    error: "btn-error",
    __aliases: { ddddanger: "error" },
  })
  _test(
    "btn btn-primary",
    btn(),
    `${btn}`,
    `${btn.primary}`,
    btn.primary()
  )
  _test(
    "btn btn-error",
    btn.error(),
    btn.ddddanger(),
  )
})