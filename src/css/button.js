import CSS from './CSS'
import variants from './variants'

const _variants = {}
variants.forEach(variant => _variants[variant] = `btn btn-${variant}`)

export default CSS({
  __base: "btn",
  __default: "primary",
  ..._variants,
})