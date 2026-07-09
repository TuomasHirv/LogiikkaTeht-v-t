function toTokens(clause) {
  const tokens = []
  let i = 0
  while (i < clause.length) {
    const ch = clause[i]
    if (ch === ",") {
      i++
      continue
    }
    if (ch === "¬") {
      tokens.push(ch)
      i++
      continue
    }
    if (/[A-Za-z]/.test(ch)) {
      tokens.push(ch.toUpperCase())
      i++
      if (i !== clause.length) {
        if (clause[i] !== ",") {
          throw new Error("Invalid literal")
        }
      }
      continue
    }
    throw new Error(
      `Invalid character "${ch}" at position ${i}. Only ∨, ∧, ¬, ( ) and letters are allowed.`,
    )
  }
  return tokens
}

function peek(tokens, index) {
  return tokens[index]
}

function consume(tokens, index, expected) {
  if (tokens[index] !== expected) {
    throw new Error(`Expected "${expected}" but got "${tokens[index]}"`)
  }
  return index + 1
}

function parseVariable(tokens, index) {
  let variable = ""
  if (peek(tokens, index) === "¬") {
    index = consume(tokens, index, "¬")
    variable += "¬"
  }
  variable += tokens[index]
  index += 1
  return { literal: variable, index }
}

function parseClauseToSet(clauseText) {
  const cleaned = clauseText.replace(/\s+/g, "")
  if (cleaned === "∅") {
    return new Set("∅")
  }
  const inner = cleaned.slice(1, -1)
  if (inner === "") return new Set("∅")

  const literals = inner.split(",").map((part) => {
    const tokens = toTokens(part.trim())
    return parseVariable(tokens, 0).literal
  })

  return new Set(literals)
}

function parseReferencedLines(justificationText) {
  const stripped = justificationText.slice(1, -1)
  if (stripped === "assumption") {
    return "assumption"
  }
  const correct = stripped.match(/\d+/g)
  if (!correct) {
    throw new Error("Justification wasnt an assumption or a correct reference")
  }
  if (correct.length !== 2) {
    throw new Error("Justification was an incorrect length:", correct)
  }
  const referencedLines = correct.map(Number)
  return referencedLines
}

function parseUserClause(input) {
  const clean = input.replace(/\s/g, "")
  const match = clean.match(/^(\{.*?\}|∅)\s*(\(.*?\))$/)
  if (!match) {
    throw new Error("Line doesnt match to expected text")
  }
  const clausePart = match[1]
  const justificationPart = match[2]
  const clauseSet = parseClauseToSet(clausePart)
  const referencedLines = parseReferencedLines(justificationPart)
  return { clause: clauseSet, justification: referencedLines }
}

function parseClauseList(listInput) {
  const clauseList = []
  let i = 0
  while (i < listInput.length) {
    clauseList.push(parseUserClause(listInput[i]))
    i++
  }
  return clauseList
}

const normalize = (lit) => (lit.startsWith("¬") ? lit.slice(1) : lit)

function stepCheck(result, ref1, ref2) {
  const combined = new Set([...ref1, ...ref2])

  for (const literal of result) {
    if (literal === "∅") continue

    if (!combined.has(literal)) {
      throw new Error(`Invalid literal ${literal} introduced in result`)
    }
  }

  let diff = 0
  let changedLiteral = null
  let emptySetFound = false
  if (result.has("∅")) {
    if (result.size !== 1) {
      throw new Error("Empty set must be the only literal in the clause")
    }
    emptySetFound = true
  }

  for (const literal of ref1) {
    if (result.has(literal)) continue

    if (diff > 1) {
      throw new Error("Too many differences in a single step")
    }
    if (literal.startsWith("¬")) {
      if (!ref2.has(literal.slice(1))) {
        throw new Error(
          `Couldn't match complement for ${literal} in ${[...ref2]}`,
        )
      }
    } else {
      if (!ref2.has("¬" + literal)) {
        throw new Error(
          `Couldn't match complement for ${literal} in ${[...ref2]}`,
        )
      }
    }
    if (changedLiteral === null) {
      changedLiteral = literal
    } else if (normalize(literal) !== normalize(changedLiteral)) {
      throw new Error(
        `Trying to change another literal ${literal} instead of ${changedLiteral}`,
      )
    }

    diff++
  }

  if (diff === 0) {
    throw new Error("No literals were changed from ref1")
  }

  diff = 0
  for (const literal of ref2) {
    if (result.has(literal)) continue

    if (diff > 1) {
      throw new Error("Too many differences in a single step")
    }
    if (normalize(literal) !== normalize(changedLiteral)) {
      throw new Error(
        `Trying to change another literal ${literal} instead of ${changedLiteral}`,
      )
    }
    if (literal.startsWith("¬")) {
      if (!ref1.has(literal.slice(1))) {
        throw new Error(
          `Couldn't match complement for ${literal} in ${[...ref1]}`,
        )
      }
    } else {
      if (!ref1.has("¬" + literal)) {
        throw new Error(
          `Couldn't match complement for ${literal} in ${[...ref1]}`,
        )
      }
    }

    diff++
  }

  if (diff === 0) {
    throw new Error("No literals were changed from ref2")
  }

  return emptySetFound
}

function validateResolutionSteps(clauseList, allowedAssumptionsCount) {
  let assumptionCount = 0
  let i = 0
  let foundEmptyClause = false
  while (i < clauseList.length) {
    const clause = clauseList[i]
    if (clause.justification === "assumption") {
      assumptionCount++
      i++
      continue
    }
    const ref1 = clauseList[clause.justification[0]].clause
    const ref2 = clauseList[clause.justification[1]].clause
    foundEmptyClause = stepCheck(clause.clause, ref1, ref2)
    i++
  }
  if (assumptionCount > allowedAssumptionsCount) {
    throw new Error("Too many assumptions used")
  }
  return foundEmptyClause
}

module.exports = {
  toTokens,
  parseClauseToSet,
  parseReferencedLines,
  parseUserClause,
  parseClauseList,
  stepCheck,
  validateResolutionSteps,
}
