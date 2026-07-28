const { parseAllLines } = require("./parseNaturalDeduction")
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
function allowedRef(lines, referencedIndex, currLineIndex) {
  const startDepth = lines[referencedIndex].depth
  let i = referencedIndex + 1
  while (i < currLineIndex) {
    if (lines[i].depth < startDepth) return false
    i++
  }
  return true
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
      found = true
      break
    }
  }
  return found
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
  if (!allowedRef(lines, currRefs[0], currRefs[1])) {
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
    case "¬E":
      return checkNotElim(lines, currLine)
  }
}

module.exports = {
  allowedRef,
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
