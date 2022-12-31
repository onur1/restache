const t = require('./types')
const { Section, InvertedSection, Element, Variable, Text, Comment, TEXT } = require('./tree')
const { RESERVED } = require('./constants')

const sectionId = /^\s*([a-zA-Z0-9_.]+)\s*(?:\(([a-zA-Z0-9_.]+)\))?\s*$/

const decode = (u, scope = [], level = 0) => {
  if (t.UnknownList(u)) {
    if (u.length < 1) {
      throw new Error('expected a non-empty array')
    }

    const [_0, _1, _2] = u

    if (t.String(_0)) {
      // is element?
      if (_0.trim().length < 1) {
        throw new Error('expected an element name, got empty string')
      }

      let props
      let forest = []

      const propVars = []
      const childrenVars = []

      let len = u.length

      if (len > 1) {
        if (!t.UnknownStruct(_1)) {
          throw new Error(`${_0}: expected a props object, got ${JSON.stringify(_1)}`)
        }

        const propNames = Object.keys(_1)

        props = {}

        let key
        let i = 0

        for (; i < propNames.length; i++) {
          key = propNames[i]

          if (RESERVED.indexOf(key) >= 0) {
            throw new Error(`${_0} > ${key}: reserved property name`)
          }

          if (!t.UnknownList(_1[key])) {
            throw new Error(`${_0} > ${key}: expected an array of child nodes, got ${JSON.stringify(_1[key])}`)
          }

          const propForest = []

          let j = 0
          for (; j < _1[key].length; j++) {
            propForest.push(decode(_1[key][j], propVars, -1))
          }

          props[key] = propForest
        }

        if (len > 2) {
          // has children?
          if (!t.UnknownList(_2)) {
            throw new Error(`${_0}: expected an array of child nodes, got ${JSON.stringify(_2)}`)
          }
          const nextLevel = level + 1
          for (let i = 0; i < _2.length; i++) {
            forest.push(decode(_2[i], childrenVars, nextLevel))
          }
        }

        // join consecutive text nodes
        i = 0
        let x, y
        for (; i < forest.length; i++) {
          if (i < 1) {
            continue
          }

          x = forest[i - 1].value
          y = forest[i].value

          if (x.type === TEXT && y.type === TEXT) {
            forest[i - 1].value.text += y.text
            forest.splice(i, 1)
            i = i - 1

            continue
          }
        }
      }

      const ownScope = childrenVars.concat(propVars)

      scope.push(...ownScope)

      if (level === 0 && childrenVars.length > 0) {
        len = ownScope.length
        const scopeProps = {}
        for (let i = 0; i < len; i++) {
          scopeProps[ownScope[i]] = true
        }
        return Element(undefined, scopeProps, [Element(_0, props, forest)])
      }

      return Element(_0, props, forest)
    } else if (t.Integer(_0) && _0 >= 2 && _0 <= 5) {
      if (_0 === 2 || _0 === 4) {
        if (!t.NonEmptyString(_1)) {
          throw new Error(`expected a non-empty string as section name, got ${JSON.stringify(_1)}`)
        }

        const forest = []

        if (u.length > 2) {
          for (let i = 0; i < _2.length; i++) {
            forest.push(decode(_2[i]))
          }
        }

        if (_0 === 2) {
          const match = _1.match(sectionId)
          if (!match) {
            throw new Error(`expected a valid section identifier, got ${JSON.stringify(_1)}`)
          }

          return Section(match[1].split('.'), forest, match[2], u.length > 3 ? u[3] : undefined)
        }

        return InvertedSection(_1, forest)
      } else if (_0 === 3) {
        if (!t.NonEmptyString(_1)) {
          throw new Error(`expected a non-empty string as variable name, got ${JSON.stringify(_1)}`)
        }

        scope.push(_1)

        return Variable(_1)
      } else {
        if (!t.String(_1)) {
          throw new Error(`expected a string as comment, got ${JSON.stringify(_1)}`)
        }

        return Comment(_1)
      }
    }

    throw new Error(`expected a tag name or a valid id, got ${JSON.stringify(_0)}`)
  }

  if (t.String(u)) {
    return Text(u)
  }

  throw new Error(`expected an array or string, got ${JSON.stringify(u)}`)
}

module.exports = decode
