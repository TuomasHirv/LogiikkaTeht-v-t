// This file is AI generated

const ruleCheck = require("./matchRuleChange")
const createTree = require("./createTree")
const areLogicallyEquivalent = require("./equivalence")

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

function findDifferences(a, b, diffs = []) {
  if (areEqual(a, b)) return diffs

  if (a.type !== b.type || a.children.length !== b.children.length) {
    diffs.push({ oldNode: a, newNode: b })
    return diffs
  }

  for (let i = 0; i < a.children.length; i++) {
    findDifferences(a.children[i], b.children[i], diffs)
  }

  return diffs
}
function isSingleStepValid(tree1, tree2) {
  const diffs = findDifferences(tree1, tree2)

  if (diffs.length !== 1) return false

  const { oldNode, newNode } = diffs[0]

  return (
    ruleCheck.matchImplicationRule(oldNode, newNode) ||
    ruleCheck.matchBiconditionalElimination(oldNode, newNode) ||
    ruleCheck.matchDoubleNegation(oldNode, newNode) ||
    ruleCheck.matchImplicationElimination(oldNode, newNode) ||
    ruleCheck.matchDeMorgan(oldNode, newNode)
  )
}

function matchText(prevText, currentText) {
  const prevTree = createTree(prevText)
  const currentTree = createTree(currentText)
  if (!currentTree || !prevTree) return false

  if (!areLogicallyEquivalent(prevTree, currentTree)) return false

  return isSingleStepValid(prevTree, currentTree)
}

module.exports = matchText
