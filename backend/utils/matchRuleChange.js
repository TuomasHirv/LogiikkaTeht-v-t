// This file is AI generated

function areEqual(a, b) {
  if (!a || !b) return false

  if (a.type !== b.type) return false
  if (a.value !== b.value) return false

  if (a.children.length !== b.children.length) return false

  for (let i = 0; i < a.children.length; i++) {
    if (!areEqual(a.children[i], b.children[i])) {
      return false
    }
  }

  return true
}

function matchImplicationRule(oldNode, newNode) {
  if (oldNode.type !== "IMPLIES") return false

  const [A, B] = oldNode.children

  if (newNode.type !== "OR") return false

  const [left, right] = newNode.children

  return (
    left.type === "NOT" && areEqual(left.children[0], A) && areEqual(right, B)
  )
}
function matchDoubleNegation(oldNode, newNode) {
  if (oldNode.type !== "NOT") return false

  const inner = oldNode.children[0]
  if (!inner || inner.type !== "NOT") return false

  const A = inner.children[0]
  return areEqual(newNode, A)
}
function matchImplicationElimination(oldNode, newNode) {
  if (oldNode.type !== "IMPLIES") return false

  const [A, B] = oldNode.children

  if (newNode.type !== "OR") return false
  const [left, right] = newNode.children

  return (
    left.type === "NOT" && areEqual(left.children[0], A) && areEqual(right, B)
  )
}
function matchBiconditionalElimination(oldNode, newNode) {
  if (oldNode.type !== "BICOND") return false

  const [A, B] = oldNode.children

  if (newNode.type !== "AND") return false
  const [left, right] = newNode.children

  const case1 =
    left.type === "IMPLIES" &&
    right.type === "IMPLIES" &&
    areEqual(left.children[0], A) &&
    areEqual(left.children[1], B) &&
    areEqual(right.children[0], B) &&
    areEqual(right.children[1], A)

  const case2 =
    left.type === "IMPLIES" &&
    right.type === "IMPLIES" &&
    areEqual(left.children[0], B) &&
    areEqual(left.children[1], A) &&
    areEqual(right.children[0], A) &&
    areEqual(right.children[1], B)

  return case1 || case2
}
function matchDeMorgan(oldNode, newNode) {
  if (oldNode.type !== "NOT") return false

  const inner = oldNode.children[0]
  if (!inner) return false

  const [A, B] = inner.children || []

  if (inner.type === "AND" && newNode.type === "OR") {
    const [left, right] = newNode.children

    return (
      left.type === "NOT" &&
      right.type === "NOT" &&
      areEqual(left.children[0], A) &&
      areEqual(right.children[0], B)
    )
  }

  if (inner.type === "OR" && newNode.type === "AND") {
    const [left, right] = newNode.children

    return (
      left.type === "NOT" &&
      right.type === "NOT" &&
      areEqual(left.children[0], A) &&
      areEqual(right.children[0], B)
    )
  }

  return false
}
module.exports = {
  matchImplicationRule,
  matchDoubleNegation,
  matchImplicationElimination,
  matchBiconditionalElimination,
  matchDeMorgan,
}
