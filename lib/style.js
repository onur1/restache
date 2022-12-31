const upperCaseSecond = (_, char) => char.toUpperCase()

const styleToObject = require('style-to-object')

const keyPattern = /-(\w|$)/g

module.exports = val => {
  const o = styleToObject(val)
  if (o === null) {
    return {}
  }

  const r = {}

  let k
  for (k in o) {
    if (Object.prototype.hasOwnProperty.call(o, k)) {
      r[k.replace(keyPattern, upperCaseSecond)] = o[k]
    }
  }

  return r
}
