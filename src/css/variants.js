const variants = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
]

variants.make = (f) => {
  const result = {}
  variants.map((variant) => (result[variant] = f(variant)))
  return result
}

export default variants
