const createTree = require("./createTree")

function isTree(node) {
  return (
    node !== null &&
    typeof node === "object" &&
    typeof node.type === "string" &&
    Array.isArray(node.children)
  )
}

function toTree(input) {
  if (typeof input === "string") {
    return createTree(input, true)
  }

  if (isTree(input)) {
    return input
  }

  return null
}

function collectVariables(node, variables = new Set()) {
  if (!node) return variables

  if (node.type === "VAR") {
    variables.add(node.value)
    return variables
  }

  for (const child of node.children || []) {
    collectVariables(child, variables)
  }

  return variables
}

function evaluate(node, assignment) {
  if (!node) return false

  switch (node.type) {
    case "VAR":
      return Boolean(assignment[node.value])
    case "NOT":
      return !evaluate(node.children[0], assignment)
    case "AND":
      return (
        evaluate(node.children[0], assignment) &&
        evaluate(node.children[1], assignment)
      )
    case "OR":
      return (
        evaluate(node.children[0], assignment) ||
        evaluate(node.children[1], assignment)
      )
    case "IMPLIES":
      return (
        !evaluate(node.children[0], assignment) ||
        evaluate(node.children[1], assignment)
      )
    case "BICOND":
      return (
        evaluate(node.children[0], assignment) ===
        evaluate(node.children[1], assignment)
      )
    default:
      return false
  }
}

function areLogicallyEquivalent(leftInput, rightInput) {
  const leftTree = toTree(leftInput)
  const rightTree = toTree(rightInput)

  if (!leftTree || !rightTree) {
    return false
  }

  const variables = [...collectVariables(leftTree), ...collectVariables(rightTree)]

  const seen = new Set()
  const uniqueVariables = []

  for (const variable of variables) {
    if (!seen.has(variable)) {
      seen.add(variable)
      uniqueVariables.push(variable)
    }
  }

  function checkAll(index, assignment) {
    if (index === uniqueVariables.length) {
      return evaluate(leftTree, assignment) === evaluate(rightTree, assignment)
    }

    const variable = uniqueVariables[index]

    assignment[variable] = false
    if (!checkAll(index + 1, assignment)) {
      return false
    }

    assignment[variable] = true
    return checkAll(index + 1, assignment)
  }

  return checkAll(0, {})
}

module.exports = areLogicallyEquivalent
