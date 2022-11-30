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

const Section = (name, forest, key, predicate) => Tree({ type: SECTION, name, key, predicate }, forest)

const InvertedSection = (name, forest) => Tree({ type: INVERTED_SECTION, name }, forest)

const Element = (name, props, forest) => Tree({ type: ELEMENT, name, props }, forest)

const Variable = name => Tree({ type: VARIABLE, name })

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
