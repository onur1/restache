const { Element, Text, Section, InvertedSection, Variable, Comment } = require('../lib/tree')
const { runSortTest } = require('./_helpers/run')

const foo = Element('foo', {}, [
  Element(
    undefined,
    {
      test: true,
    },
    [
      Element('foo-1', {}, [
        Element('foo-11'),
        Comment('hi'),
        Element('foo-12'),
        InvertedSection(
          ['foo-13'],
          [Text('x'), Element('foo-131', {}, [Section(['y'], [Variable('test'), Element('foo-1311')])])]
        ),
      ]),
    ]
  ),
])

const bar = Element('bar', {}, [Element('bar-1'), Element('qux', {}, [Element('foo')])])

const qux = Element('qux')

const sortTestCases = [
  {
    desc: 'dependency graph',
    input: [bar, foo, qux],
    expected: [qux, foo, bar],
  },
]

sortTestCases.map(runSortTest)
