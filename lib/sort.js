const { INVERTED_SECTION, SECTION, ELEMENT, VARIABLE, COMMENT, TEXT } = require('./tree')

const has = Object.prototype.hasOwnProperty

const uniq = xs => {
  let ys = []
  let seen = {}
  let i = 0
  let x
  const len = xs.length
  for (; i < len; i++) {
    x = xs[i]
    if (!has.call(seen, x)) {
      ys.push(x)
    }
    seen[x] = true
  }
  return ys
}

const Vertex = (id, afters) => ({ id, afters })

const tsort = graph => {
  const sorted = []
  const visited = {}
  const recursive = {}

  Object.keys(graph).forEach(function visit(id, ancestors) {
    if (visited[id]) {
      return
    }

    if (!has.call(graph, id)) {
      return
    }

    const vertex = graph[id]
    if (!Array.isArray(ancestors)) {
      ancestors = []
    }

    ancestors.push(id)
    visited[id] = true

    vertex.afters.forEach(afterId => {
      if (ancestors.indexOf(afterId) >= 0) {
        recursive[id] = true
        recursive[afterId] = true
      } else {
        visit(afterId, ancestors.slice())
      }
    })

    sorted.unshift(id)
  })

  return {
    sorted: sorted.filter(id => !has.call(recursive, id)),
    recursive,
  }
}

const getDependencies = e => {
  switch (e.value.type) {
    case INVERTED_SECTION:
    case SECTION:
      return e.forest.flatMap(getDependencies)
    case ELEMENT:
      return [e.value.name].concat(...e.forest.flatMap(getDependencies))
    case VARIABLE:
    case COMMENT:
    case TEXT:
      return []
  }
}

const getDependencyGraph = trees => {
  const graph = {}
  let deps, name

  trees.forEach(({ forest, value }) => {
    name = value.name
    deps = forest.flatMap(getDependencies)
    graph[name] = Vertex(name, deps.length > 1 ? uniq(deps) : deps)
  })

  return graph
}

const sort = roots => {
  const graph = getDependencyGraph(roots)
  const { sorted } = tsort(graph)
  const o = {}
  roots.forEach(d => {
    o[d.value.name] = d
  })
  return sorted.reverse().map(name => o[name])
}

module.exports = sort
