const { parseAllLines, allowedRef } = require("./parseNaturalDeduction")
const { findMainConnective } = require("./validateSemanticTree")

function formulasEqual(f1, f2) {
  const p1 = findMainConnective(f1)
  const p2 = findMainConnective(f2)

  if (p1.type !== p2.type) return false
  if (p1.type === "VAR") return p1.value === p2.value
  if (p1.type === "NOT") return formulasEqual(p1.inner, p2.inner)
  return formulasEqual(p1.left, p2.left) && formulasEqual(p1.right, p2.right)
}
/** Checks that the reference path is legal
 * @param {[{formula: "", depth: int, rule: "", refs: []}]} lines :List of all lines
 * @param {int} referencedIndex
 * @param {int} currLineIndex
 */

function checkReiteration(lines, currLine) {
  if (currLine.refs.length !== 1) {
    throw new Error("Reiteration Always takes one reference")
  }
  const ref = lines[currLine.refs[0]]
  if (ref.depth > currLine.depth) {
    throw new Error("Can't reiterate from deeper scope")
  }
  if (!formulasEqual(currLine.formula, ref.formula)) {
    throw new Error(`Ref: ${ref.formula} doesn't match ${currLine.formula}`)
  }
}

/**
 * @param {{formula: "", depth: int, rule: "", refs: []}} currLine
 * @param {[""]} premises
 * @returns
 */
function checkPremise(currLine, premises) {
  let found = false
  for (const premise of premises) {
    if (premise === currLine.formula) {
      return
    }
  }
  throw new Error(`${currLine.formula} not in premises`)
}
/**
 * @param {[{formula: "", depth: int, rule: "", refs: []}]} lines
 * @param {{formula: "", depth: int, rule: "", refs: []}} currLine
 */
function checkAndIntro(lines, currLine) {
  if (currLine.refs.length !== 2) {
    throw new Error("∧I Always takes two references")
  }

  const [leftRef, rightRef] = currLine.refs.map((r) => lines[r].formula)
  const currFormula = currLine.formula
  const parsed = findMainConnective(currFormula)

  if (parsed.type !== "AND") {
    throw new Error(`Not correct type: ${currFormula}`)
  }
  if (
    formulasEqual(parsed.left, leftRef) &&
    formulasEqual(parsed.right, rightRef)
  ) {
    return
  }
  if (
    formulasEqual(parsed.left, rightRef) &&
    formulasEqual(parsed.right, leftRef)
  ) {
    return
  }

  throw new Error(`${currFormula} doesn't match refs`)
}

/**
 * @param {[{formula: "", depth: int, rule: "", refs: []}]} lines
 * @param {{formula: "", depth: int, rule: "", refs: []}} currLine
 */
function checkAndElim(lines, currLine) {
  if (currLine.refs.length !== 1) {
    throw new Error("∧E Takes exactly one reference")
  }
  const refFormula = lines[currLine.refs[0]].formula
  const parsedRef = findMainConnective(refFormula)
  if (parsedRef.type !== "AND") {
    throw new Error("Ref didnt have ∧ main connective")
  }
  if (
    formulasEqual(parsedRef.left, currLine.formula) ||
    formulasEqual(parsedRef.right, currLine.formula)
  ) {
    return
  }

  throw new Error(`${currLine.formula} can't be derived from this`)
}

/**
 *
 * @param {[{formula: "", depth: int, rule: "", refs: []}]} lines
 * @param {{formula: "", depth: int, rule: "", refs: []}} currLine
 */
function checkImpElim(lines, currLine) {
  if (currLine.refs.length !== 2) {
    throw new Error("→E Always takes two references")
  }

  const [leftRef, rightRef] = currLine.refs.map((r) => lines[r].formula)
  const currFormula = currLine.formula
  const parsedLeft = findMainConnective(leftRef)
  if (
    parsedLeft.type === "IMPLIES" &&
    formulasEqual(parsedLeft.right, currFormula)
  ) {
    if (formulasEqual(parsedLeft.left, rightRef)) {
      return
    }
  }
  const parsedRight = findMainConnective(rightRef)
  if (
    parsedRight.type === "IMPLIES" &&
    formulasEqual(parsedRight.right, currFormula)
  ) {
    if (formulasEqual(parsedRight.left, leftRef)) {
      return
    }
  }
  throw new Error(`Incorrect refs : ${currLine.refs}`)
}

function checkImpIntro(lines, currLine, index) {
  if (currLine.refs.length !== 2) {
    throw new Error(`→I Must have two references`)
  }
  const currRefs = currLine.refs
  const [leftRef, rightRef] = currRefs.map((r) => lines[r])
  if (currRefs[1] !== index - 1 || rightRef.depth !== currLine.depth + 1) {
    throw new Error("→I Must discharge the assumption")
  }
  if (leftRef.depth !== rightRef.depth) {
    throw new Error("Refs must be on the same assumption")
  }
  if (leftRef.rule !== "assumption") {
    throw new Error("First ref to →I must be 'assumption'")
  }
  if (rightRef.rule === "assumption") {
    throw new Error("Second ref to →I can't be 'assumption'")
  }
  if (!allowedRef(lines, currRefs[0], currRefs[1], true)) {
    throw new Error(`Refs ${currRefs} not on the same assumption`)
  }
  const currFormula = currLine.formula
  const currParsed = findMainConnective(currFormula)
  if (currParsed.type !== "IMPLIES") {
    throw new Error(`${currLine.formula} isn't the correct type`)
  }
  if (!formulasEqual(currParsed.left, leftRef.formula)) {
    throw new Error(`Antecedent must be second Ref`)
  }
  if (!formulasEqual(currParsed.right, rightRef.formula)) {
    throw new Error(`Consequent must be first Ref`)
  }
  return
}

function checkBicondIntro(lines, currLine) {
  if (currLine.refs.length !== 2) {
    throw new Error(`↔I Must have two references`)
  }
  const [leftRef, rightRef] = currLine.refs.map((r) => lines[r].formula)
  const leftParsed = findMainConnective(leftRef)
  if (leftParsed.type !== "IMPLIES") {
    throw new Error(`↔I has to reference implications`)
  }
  const rightParsed = findMainConnective(rightRef)
  if (rightParsed.type !== "IMPLIES") {
    throw new Error(`↔I has to reference implications`)
  }
  const currParsed = findMainConnective(currLine.formula)
  if (currParsed.type !== "BICOND") {
    throw new Error(`${currLine.formula} isn't the correct type`)
  }
  // Here its important to note the order that is checked.
  // P ↔ Q is created by P → Q and Q → P. One ref has to have P on left and Q on right.
  // If one does have that then the other should have P on the right and Q on the left
  // In all other cases this is a mistake
  if (
    formulasEqual(currParsed.left, leftParsed.left) &&
    formulasEqual(currParsed.right, leftParsed.right)
  ) {
    if (
      formulasEqual(currParsed.right, rightParsed.left) &&
      formulasEqual(currParsed.left, rightParsed.right)
    ) {
      return
    }
  }
  // Mirrored Checking the right ref first.
  if (
    formulasEqual(currParsed.left, rightParsed.left) &&
    formulasEqual(currParsed.right, rightParsed.right)
  ) {
    if (
      formulasEqual(currParsed.right, leftParsed.left) &&
      formulasEqual(currParsed.left, leftParsed.right)
    ) {
      return
    }
  }

  throw new Error(`Refs don't match result`)
}

function checkBicondElim(lines, currLine) {
  if (currLine.refs.length !== 1) {
    throw new Error(`↔E Must have one reference`)
  }
  const refFormula = lines[currLine.refs[0]].formula
  const refParsed = findMainConnective(refFormula)
  if (refParsed.type !== "BICOND") {
    throw new Error(`↔E Must reference a biconditional`)
  }
  const currParsed = findMainConnective(currLine.formula)
  if (currParsed.type !== "IMPLIES") {
    throw new Error(`${currLine.formula} isn't the correct type`)
  }
  if (
    formulasEqual(currParsed.left, refParsed.left) &&
    formulasEqual(currParsed.right, refParsed.right)
  ) {
    return
  }
  if (
    formulasEqual(currParsed.right, refParsed.left) &&
    formulasEqual(currParsed.left, refParsed.right)
  ) {
    return
  }
  throw new Error(`Ref doesn't match result`)
}

function checkOrIntro(lines, currLine) {
  if (currLine.refs.length !== 1) {
    throw new Error(`∨I Must have one reference`)
  }
  const [ref] = currLine.refs.map((r) => lines[r])
  const refFormula = ref.formula
  const currParsed = findMainConnective(currLine.formula)
  if (currParsed.type !== "OR") {
    throw new Error(`${currLine.formula} isn't the correct type`)
  }
  const rightMatch = formulasEqual(currParsed.right, refFormula)
  const leftMatch = formulasEqual(currParsed.left, refFormula)
  if (!rightMatch && !leftMatch) {
    throw new Error(`Neither side matches ${refFormula}`)
  }
}

function checkNotElim(lines, currLine) {
  if (currLine.refs.length !== 1) {
    throw new Error(`¬E Must have one reference`)
  }
  const [ref] = currLine.refs.map((r) => lines[r].formula)
  const currFormula = currLine.formula
  const parsedRef = findMainConnective(ref)
  const possibleError = `${ref} isn't a double negation of ${currFormula}`

  if (parsedRef.type !== "NOT") {
    throw new Error(possibleError)
  }
  const innerParsed = findMainConnective(parsedRef.inner)
  if (innerParsed.type !== "NOT") {
    throw new Error(possibleError)
  }
  if (!formulasEqual(innerParsed.inner, currFormula)) {
    throw new Error(possibleError)
  }
}

// This function is AI-coded
function checkOrElim(lines, currLine, currIndex) {
  if (currLine.refs.length !== 5) {
    throw new Error("∨E must have exactly five references")
  }
  const [disjIdx, a1Idx, l1Idx, a2Idx, l2Idx] = currLine.refs
  const disjLine = lines[disjIdx]
  const a1 = lines[a1Idx],
    l1 = lines[l1Idx]
  const a2 = lines[a2Idx],
    l2 = lines[l2Idx]

  if (a1.rule !== "assumption" || a2.rule !== "assumption") {
    throw new Error("Both boxes must open with an assumption")
  }

  if (a1.depth !== currLine.depth + 1 || l1.depth !== a1.depth) {
    throw new Error("First box isn't well-formed relative to the conclusion")
  }
  if (a2.depth !== currLine.depth + 1 || l2.depth !== a2.depth) {
    throw new Error("Second box isn't well-formed relative to the conclusion")
  }

  const disjoint = l1Idx < a2Idx || l2Idx < a1Idx
  if (!disjoint) {
    throw new Error("The two boxes must not overlap")
  }

  if (!allowedRef(lines, a1Idx, l1Idx, true)) {
    throw new Error("First box's last line isn't validly within it")
  }
  if (!allowedRef(lines, a2Idx, l2Idx, true)) {
    throw new Error("Second box's last line isn't validly within it")
  }

  const finalRefIndex = Math.max(l1Idx, l2Idx)
  if (currIndex !== finalRefIndex + 1) {
    throw new Error("∨E must immediately follow the last discharged box")
  }
  const disjParsed = findMainConnective(disjLine.formula)
  if (disjParsed.type !== "OR") {
    throw new Error(`${disjLine.formula} isn't a disjunction`)
  }
  const pairForward =
    formulasEqual(a1.formula, disjParsed.left) &&
    formulasEqual(a2.formula, disjParsed.right)
  const pairBackward =
    formulasEqual(a1.formula, disjParsed.right) &&
    formulasEqual(a2.formula, disjParsed.left)
  if (!pairForward && !pairBackward) {
    throw new Error("The two assumptions must be the two disjuncts")
  }

  if (
    !formulasEqual(l1.formula, currLine.formula) ||
    !formulasEqual(l2.formula, currLine.formula)
  ) {
    throw new Error("Both boxes must conclude the formula being proven")
  }
}

//This function is AI-coded
function isContradiction(formula) {
  const parsed = findMainConnective(formula)
  if (parsed.type !== "AND") return false
  const parsedLeft = findMainConnective(parsed.left)
  const parsedRight = findMainConnective(parsed.right)
  const leftIsNegOfRight =
    parsedLeft.type === "NOT" && formulasEqual(parsedLeft.inner, parsed.right)
  const rightIsNegOfLeft =
    parsedRight.type === "NOT" && formulasEqual(parsedRight.inner, parsed.left)
  return leftIsNegOfRight || rightIsNegOfLeft
}

//This function is AI-coded
function checkContradiction(lines, currLine) {
  if (currLine.refs.length !== 2) {
    throw new Error("Contradiction requires exactly two references")
  }
  const [leftRef, rightRef] = currLine.refs.map((r) => lines[r].formula)
  const currFormula = currLine.formula
  const parsed = findMainConnective(currFormula)

  if (!isContradiction(currFormula)) {
    throw new Error(`${currFormula} isn't a formula and its negation`)
  }

  // now confirm refs actually match the two conjuncts, either order
  const matchesForward =
    formulasEqual(parsed.left, leftRef) && formulasEqual(parsed.right, rightRef)
  const matchesBackward =
    formulasEqual(parsed.left, rightRef) && formulasEqual(parsed.right, leftRef)

  if (!matchesForward && !matchesBackward) {
    throw new Error(`${currFormula} doesn't match refs`)
  }
}

//This function is AI-coded
function checkNotIntro(lines, currLine, index) {
  if (currLine.refs.length !== 2) {
    throw new Error("¬I must have exactly two references")
  }
  const [assumeIdx, lastIdx] = currLine.refs
  const assumeRef = lines[assumeIdx]
  const lastRef = lines[lastIdx]
  if (!allowedRef(lines, assumeIdx, lastIdx, true)) {
    throw new Error(
      "Second ref must be within the same open assumption as the first ref",
    )
  }
  if (lastIdx !== index - 1 || lastRef.depth !== currLine.depth + 1) {
    throw new Error("¬I must discharge the assumption")
  }
  if (assumeRef.depth !== lastRef.depth) {
    throw new Error("Refs must be on the same assumption")
  }
  if (assumeRef.rule !== "assumption") {
    throw new Error("First ref to ¬I must be 'assumption'")
  }

  // last line of the box must itself be a valid contradiction shape: X ∧ ¬X
  isContradiction(lastRef.formula)
  // conclusion must be exactly ¬(assumption)
  const currParsed = findMainConnective(currLine.formula)
  if (currParsed.type !== "NOT") {
    throw new Error(`${currLine.formula} isn't the correct type`)
  }
  if (!formulasEqual(currParsed.inner, assumeRef.formula)) {
    throw new Error("¬I must conclude the negation of the assumption")
  }
}

/** CHECKS THE VALIDITY OF EACH LINE.
 * @param {[{formula: "", depth: int, rule: "", refs: []}]} lines :List of all lines
 * @param {int} index :Index of the current line
 * @param {[""]} premises :List of allowed premises
 */
function checkLine(lines, index, premises) {
  /**@param {{formula: "", depth: int, rule: "", refs: []}} currLine*/
  const currLine = lines[index]
  for (const ref of currLine.refs) {
    const targets = Array.isArray(ref) ? ref : [ref]
    for (const t of targets) {
      if (!allowedRef(lines, t, index)) {
        throw new Error(`Bad reference at: ${index}`)
      }
    }
  }
  switch (currLine.rule) {
    case "premise":
      return checkPremise(currLine, premises)
    case "assumption":
      return true
    case "reiteration":
      return checkReiteration(lines, currLine)
    case "contradiction":
      return checkContradiction(lines, currLine)
    case "∧I":
      return checkAndIntro(lines, currLine)
    case "∧E":
      return checkAndElim(lines, currLine)
    case "→I":
      return checkImpIntro(lines, currLine, index)
    case "→E":
      return checkImpElim(lines, currLine)
    case "∨I":
      return checkOrIntro(lines, currLine)
    case "∨E":
      return checkOrElim(lines, currLine, index)
    case "¬I":
      return checkNotIntro(lines, currLine, index)
    case "¬E":
      return checkNotElim(lines, currLine)
    case "↔I":
      return checkBicondIntro(lines, currLine)
    case "↔E":
      return checkBicondElim(lines, currLine)
  }
}

module.exports = {
  checkPremise,
  checkAndIntro,
  checkAndElim,
  checkImpElim,
  checkImpIntro,
  checkOrIntro,
  checkNotElim,
  checkLine,
  formulasEqual,
}
