import CSS from '../src/css/CSS'

const qna = (a, ...tests) => tests.forEach((q) => expect(a).toBe(q))

test('CSS', () => {
  const btn = CSS({
    __base: 'btn',
    __default: 'primary',
    primary: 'btn-primary',
    error: 'btn-error',
    __aliases: { ddddanger: 'error' },
  })
  qna('btn btn-primary', btn(), `${btn}`, `${btn.primary}`, btn.primary())
  qna('btn btn-error', btn.error(), btn.ddddanger())
})
