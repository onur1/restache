const Tree = (value, forest = []) => ({
  value,
  forest,
})

const SECTION = 'Section'
const INVERTED_SECTION = 'InvertedSection'
const ELEMENT = 'Element'
const VARIABLE = 'Variable'
const TEXT = 'Text'
const COMMENT = 'Comment'

const Section = (path, forest, key, predicate) => Tree({ type: SECTION, path, key, predicate }, forest)

const InvertedSection = (path, forest) => Tree({ type: INVERTED_SECTION, path }, forest)

const Element = (component, props, forest) => Tree({ type: ELEMENT, component, props }, forest)

const Variable = key => Tree({ type: VARIABLE, key })

const Text = text => Tree({ type: TEXT, text })

const Comment = comment => Tree({ type: COMMENT, comment })

module.exports = {
  SECTION,
  INVERTED_SECTION,
  ELEMENT,
  VARIABLE,
  TEXT,
  COMMENT,
  Section,
  InvertedSection,
  Element,
  Variable,
  Text,
  Comment,
}
