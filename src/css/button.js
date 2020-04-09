import CSS from './CSS'

const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
const _variants = {}
variants.forEach(variant => _variants[variant] = `btn btn-${variant}`)

export default CSS({
  __base: "btn",
  __default: "primary",
  ..._variants,
})