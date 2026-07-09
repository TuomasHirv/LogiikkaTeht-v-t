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
  const inner = clauseText.trim().slice(1, -1).trim()
  if (inner === "") return new Set()

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
  const match = clean.match(/^(\{.*?\})\s*(\(.*?\))$/)
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

module.exports = {
  toTokens,
  parseClauseToSet,
  parseReferencedLines,
  parseUserClause,
  parseClauseList,
}
