const test = require("node:test")
const assert = require("node:assert/strict")

const matchAnswer = require("./matchTree")

test("accepts implication elimination", () => {
  assert.equal(matchAnswer("¬A∨B", "A→B"), true)
})

test("accepts biconditional elimination", () => {
  assert.equal(matchAnswer("(A→B)∧(B→A)", "A↔B"), true)
})

test("rejects a single rewrite that does not match a supported rule", () => {
  assert.equal(matchAnswer("A∧B", "A→B"), false)
})

test("rejects changes with more than one difference", () => {
  assert.equal(matchAnswer("C∧D", "A∧B"), false)
})
