const test = require("node:test")
const assert = require("node:assert/strict")

const areLogicallyEquivalent = require("./equivalence")

test("treats implication and disjunction form as equivalent", () => {
  assert.equal(areLogicallyEquivalent("A→B", "¬A∨B"), true)
})

test("treats commuted conjunctions as equivalent", () => {
  const leftTree = {
    type: "AND",
    value: null,
    children: [
      { type: "VAR", value: "A", children: [] },
      { type: "VAR", value: "B", children: [] },
    ],
  }

  const rightTree = {
    type: "AND",
    value: null,
    children: [
      { type: "VAR", value: "B", children: [] },
      { type: "VAR", value: "A", children: [] },
    ],
  }

  assert.equal(areLogicallyEquivalent(leftTree, rightTree), true)
})

test("rejects non-equivalent propositions", () => {
  assert.equal(areLogicallyEquivalent("A→B", "B→A"), false)
})

test("rejects invalid input", () => {
  assert.equal(areLogicallyEquivalent("A→", "¬A∨B"), false)
})
