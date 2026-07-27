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
  if (justification === "premise" || justification === "assumption") {
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
    if (!(currDepth - 1 === lastDepth)) {
      throw new Error(`Assumption should be indented by one`)
    }
  } else if (currDepth > lastdepth) {
    throw new Error(`Only assumptions can indent`)
  }
}

function validateDepthDecrease(rule, currDepth, lastDepth) {
  const DISCHARGE_RULES = new Set(["→I", "¬I", "∨E"])
  if (!DISCHARGE_RULES.has(rule)) {
    if (currDepth >= lastDepth) {
      return
    }
    throw new Error(`rule ${rule} shouldnt indent or dedent`)
  }

  if (rule === "∨E") {
    if (currDepth === lastDepth - 2) {
      return
    }
    throw new Error(`rule ${rule} should dedent by two`)
  }

  if (currDepth === lastDepth - 1) {
    return
  }
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
  if (!allowedRules.has(rule) && rule !== "premise") {
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
  return lines
}

module.exports = {
  turnTextToLine,
  splitJustificationFormula,
  parseJustification,
  parseAllLines,
}
