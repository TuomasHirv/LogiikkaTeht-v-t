const { parseAllLines } = require("./parseNaturalDeduction")
const { findMainConnective } = require("./validateSemanticTree")
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
 *
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
  if (parsed.left === leftRef && parsed.right === rightRef) return
  if (parsed.left === rightRef && parsed.right === leftRef) return
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
    parsedRef.left === currLine.formula ||
    parsedRef.right === currLine.formula
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
  if (parsedLeft.right === currFormula && parsedLeft.type === "IMPLIES") {
    if (parsedLeft.left === rightRef) {
      return
    }
  }
  const parsedRight = findMainConnective(rightRef)
  if (parsedRight.right === currFormula && parsedRight.type === "IMPLIES") {
    if (parsedRight.left === leftRef) {
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
    throw new Error(``)
  }
  const currFormula = currLine.formula
  const currParsed = findMainConnective(currFormula)
  if (currParsed.type !== "IMPLIES") {
    throw new Error(`${currLine.formula} isn't the correct type`)
  }
  if (currParsed.left !== leftRef.formula) {
    throw new Error(`Antecedent must be second Ref`)
  }
  if (
    currParsed.right !== rightRef.formula &&
    currParsed.right !== "(" + rightRef.formula + ")"
  ) {
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
  const rightMatch =
    currParsed.right === refFormula ||
    currParsed.right === "(" + refFormula + ")"
  const leftMatch =
    currParsed.left === refFormula || currParsed.left === "(" + refFormula + ")"
  if (!rightMatch && !leftMatch) {
    throw new Error(`Neither side matches ${ref}`)
  }
}

function checkNotElim(lines, currLine) {
  if (currLine.refs.length !== 1) {
    throw new Error(`¬E Must have one reference`)
  }
  const [ref] = currLine.refs.map((r) => lines[r].formula)
  const currFormula = currLine.formula
  const possibleForms = [
    "¬¬" + currFormula,
    "¬¬(" + currFormula + ")",
    "¬(¬" + currFormula + ")",
    "¬(¬(" + currFormula + "))",
  ]
  if (!possibleForms.includes(ref)) {
    throw new Error(`${ref} isn't a double negation of ${currFormula}`)
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
