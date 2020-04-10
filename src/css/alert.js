import CSS from './CSS'
import variants from './variants'

export default CSS({
  __base: 'alert',
  __default: 'primary',
  ...variants.toMap((variant) => `alert-${variant}`),
})
