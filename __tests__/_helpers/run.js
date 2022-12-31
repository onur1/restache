const jsonDiff = require('json-diff')
const decode = require('../../lib/decode')
const sort = require('../../lib/sort')

const isObject = o => typeof o === 'object' && o !== null

const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) {
    return true
  } else if (isObject(obj1) && isObject(obj2)) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false
    }
    let prop
    for (prop in obj1) {
      if (!deepEqual(obj1[prop], obj2[prop])) {
        return false
      }
    }
    return true
  }
}

const run = (fn, suite) => tc =>
  it(suite + ': ' + tc.desc, () => {
    let res, err
    try {
      res = fn(tc.input)
    } catch (e) {
      err = e
    }
    if (tc.expectedErr) {
      if (!err || !(err instanceof Error) || !err.message.startsWith(tc.expectedErr)) {
        // console.trace(err)
        throw new Error(
          `${suite}: ${tc.desc}: expected the error message to start with "${tc.expectedErr}", got "${
            (err || {}).message
          }"`
        )
      }
      return
    } else {
      if (err) {
        // console.trace(err)
        throw new Error(`${suite}: ${tc.desc}: ${(err || {}).message}`)
      }
    }
    if (!deepEqual(res, tc.expected)) {
      throw new Error(`${suite}: ${tc.desc}:\n${jsonDiff.diffString(res, tc.expected, { full: true, color: true })}`)
    }
  })

const runDecodeTest = run(x => decode(x), 'lex')

const runSortTest = run(x => sort(x), 'sort')

module.exports = {
  runDecodeTest,
  runSortTest,
}
