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
function matchOrDistribution(oldNode, newNode) {
  if (oldNode.type !== "OR") return false

  const [left, right] = oldNode.children

  // A ∨ (B ∧ C): the AND can be on either side of the OR
  let A, B, C
  if (right && right.type === "AND") {
    A = left
    ;[B, C] = right.children
  } else if (left && left.type === "AND") {
    A = right
    ;[B, C] = left.children
  } else {
    return false
  }

  if (newNode.type !== "AND") return false
  const [nLeft, nRight] = newNode.children
  if (!nLeft || !nRight || nLeft.type !== "OR" || nRight.type !== "OR")
    return false

  // (A ∨ B) ∧ (A ∨ C), allowing B/C to land in either order
  const forward =
    areEqual(nLeft.children[0], A) &&
    areEqual(nLeft.children[1], B) &&
    areEqual(nRight.children[0], A) &&
    areEqual(nRight.children[1], C)

  const swapped =
    areEqual(nLeft.children[0], A) &&
    areEqual(nLeft.children[1], C) &&
    areEqual(nRight.children[0], A) &&
    areEqual(nRight.children[1], B)

  return forward || swapped
}

function matchAndDistribution(oldNode, newNode) {
  if (oldNode.type !== "AND") return false

  const [left, right] = oldNode.children

  // A ∧ (B ∨ C): the OR can be on either side of the AND
  let A, B, C
  if (right && right.type === "OR") {
    A = left
    ;[B, C] = right.children
  } else if (left && left.type === "OR") {
    A = right
    ;[B, C] = left.children
  } else {
    return false
  }

  if (newNode.type !== "OR") return false
  const [nLeft, nRight] = newNode.children
  if (!nLeft || !nRight || nLeft.type !== "AND" || nRight.type !== "AND")
    return false

  // (A ∧ B) ∨ (A ∧ C), allowing B/C to land in either order
  const forward =
    areEqual(nLeft.children[0], A) &&
    areEqual(nLeft.children[1], B) &&
    areEqual(nRight.children[0], A) &&
    areEqual(nRight.children[1], C)

  const swapped =
    areEqual(nLeft.children[0], A) &&
    areEqual(nLeft.children[1], C) &&
    areEqual(nRight.children[0], A) &&
    areEqual(nRight.children[1], B)

  return forward || swapped
}

module.exports = {
  matchImplicationRule,
  matchDoubleNegation,
  matchImplicationElimination,
  matchBiconditionalElimination,
  matchDeMorgan,
  matchOrDistribution,
  matchAndDistribution,
}
