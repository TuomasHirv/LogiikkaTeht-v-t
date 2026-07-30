const DISCHARGE_RULES = new Set(["→I", "¬I", "∨E"])

function countDepth(text) {
  let depth = 0
  let i = 0
  while (i < text.length) {
    const char = text[i]
    if (char === "|") {
      depth++
      i++
      continue
    } else if (char === " ") {
      i++
      continue
    }
    break
  }
  return { depth: depth, rest: text.slice(i) }
}

function allowedRef(lines, referencedIndex, currLineIndex, siblingCloses) {
  if (referencedIndex >= currLineIndex) return false
  const startDepth = lines[referencedIndex].depth
  let i = referencedIndex + 1
  while (i < currLineIndex) {
    if (lines[i].depth < startDepth) return false
    if (
      siblingCloses &&
      lines[i].rule === "assumption" &&
      lines[i].depth === startDepth
    )
      return false
    i++
  }
  return true
}

function splitJustificationFormula(text) {
  const open = text.lastIndexOf("(")
  const close = text.lastIndexOf(")")
  if (open === -1 || close === -1) {
    throw new Error(`Missing brackets in ${text}`)
  }
  return {
    formula: text.slice(0, open),
    justification: text.slice(open + 1, close),
  }
}

function parseJustification(justification) {
  const preApproved = new Set(["premise", "assumption", "reiteration"])
  if (preApproved.has(justification)) {
    return { rule: justification, refs: [] }
  }
  const colon = justification.indexOf(":")
  if (colon === -1) {
    throw new Error(`Wrong syntax: ${justification}`)
  }
  const rule = justification.slice(0, colon).replace(/,?\s*lines?$/, "")
  const refs = justification
    .slice(colon + 1)
    .split(",")
    .map((part) => parseRef(part))
  return { rule, refs }
}

function parseRef(part) {
  if (part.includes("-")) {
    const [start, end] = part.split("-")
    return [Number(start.trim()), Number(end.trim())]
  }
  return Number(part)
}

function validateDepthIncrease(rule, currDepth, lastDepth) {
  if (rule === "assumption") {
    if (
      (currDepth - 1 !== lastDepth && currDepth !== lastDepth) ||
      currDepth === 0
    ) {
      throw new Error(`Assumption should be indented`)
    }
  } else if (currDepth > lastDepth) {
    throw new Error(`Only assumptions can indent`)
  }
}

function validateDepthDecrease(rule, currDepth, lastDepth) {
  if (!DISCHARGE_RULES.has(rule)) {
    if (currDepth >= lastDepth) return
    throw new Error(`rule ${rule} shouldnt dedent`)
  }
  if (currDepth === lastDepth - 1) return
  throw new Error(`rule ${rule} should dedent by one`)
}

function validateDepth(rule, currDepth, lastDepth) {
  validateDepthIncrease(rule, currDepth, lastDepth)
  validateDepthDecrease(rule, currDepth, lastDepth)
}

function turnTextToLine(text, index, allowedRules, lastDepth = 0) {
  const removedWhitespace = text.replace(/\s/g, "")
  const { depth, rest } = countDepth(removedWhitespace)
  const { formula, justification } = splitJustificationFormula(rest)
  const { rule, refs } = parseJustification(justification)
  validateDepth(rule, depth, lastDepth)
  if (!allowedRules.has(rule) && rule !== "premise" && rule !== "reiteration") {
    throw new Error(`Rule ${rule} is not allowed in this task`)
  }
  let i = 0
  for (const ref of refs) {
    if (Array.isArray(ref)) {
      if (ref[0] >= index || ref[1] >= index || ref[0] > ref[1]) {
        throw new Error(`Invalid reference at line ${index}`)
      }
    } else if (ref >= index) {
      throw new Error(`Invalid reference at line ${index}`)
    }
  }
  return { formula, depth, rule, refs }
}

function parseAllLines(userList, allowedRules) {
  let i = 0
  let lastDepth = 0
  let lines = []
  while (i < userList.length) {
    const currText = userList[i]
    const newLine = turnTextToLine(currText, i, allowedRules, lastDepth)
    lastDepth = newLine.depth
    lines.push(newLine)
    i++
  }
  let index = 0
  while (index < lines.length) {
    const currLine = lines[index]
    const siblingCloses = !DISCHARGE_RULES.has(currLine.rule)
    for (const ref of currLine.refs) {
      if (!allowedRef(lines, ref, index, siblingCloses)) {
        throw new Error(`Bad reference at: ${index}`)
      }
    }
    index++
  }
  return lines
}

module.exports = {
  turnTextToLine,
  splitJustificationFormula,
  parseJustification,
  parseAllLines,
  validateDepth,
  allowedRef,
}
