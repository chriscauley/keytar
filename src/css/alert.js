const base = 'p-4 mb-4 '
const alert = { toString: () => base }
alert.error = alert + 'text-red '
alert.success = alert + 'bg-green text-white '

export default alert
