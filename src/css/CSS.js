import classnames from 'classnames'

function cssFunc(__base, value) {
  value = __base + ' ' + value
  // TODO using "a, b, c, d, e, f" in place of "...args" here takes this from 1600 to 500 ms per 2M calls
  // maybe there's a faster way to do this?
  function func(...args) {
    return classnames(value, ...args)
  }
  func.toString = func
  return func
}

export default ({
  __base = '',
  __default = '',
  __aliases = {},
  ...variants
}) => {
  const root = cssFunc(__base, variants[__default])
  Object.entries(variants).forEach(
    ([key, value]) => (root[key] = cssFunc(__base, value)),
  )
  if (!variants.base) {
    root.base = cssFunc(__base, '')
  }
  Object.entries(__aliases).forEach(
    ([alias, original]) => (root[alias] = root[original]),
  )
  return root
}
