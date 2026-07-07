function toTokens(input) {
  const tokens = []
  let i = 0
  const text = input.replace(/\s/g, "")
  while (i < text.length) {
    const ch = text[i]
    if (ch === "(" || ch === ")") {
      tokens.push(ch)
      i++
      continue
    }
    if (ch === "¬") {
      tokens.push(ch)
      i++
      continue
    }
    if (ch === "∧") {
      tokens.push(ch)
      i++
      continue
    }
    if (ch === "∨") {
      tokens.push(ch)
      i++
      continue
    }

    if (/[A-Za-z]/.test(ch)) {
      tokens.push(ch.toUpperCase())
      i++
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

function parseClauseCNF(tokens, index) {
  if (peek(tokens, index) === "(") {
    index = consume(tokens, index, "(")
    const group = []
    const first = parseVariable(tokens, index)
    group.push(first.literal)
    index = first.index
    while (peek(tokens, index) === "∨") {
      index = consume(tokens, index, "∨")
      const next = parseVariable(tokens, index)
      group.push(next.literal)
      index = next.index
    }
    index = consume(tokens, index, ")")
    return { clause: group, index }
  }
  const single = parseVariable(tokens, index)
  return { clause: [single.literal], index: single.index }
}

function parseCNF(tokens, index) {
  const clauses = []

  const first = parseClauseCNF(tokens, index)
  clauses.push(first.clause)
  index = first.index
  while (peek(tokens, index) === "∧") {
    index = consume(tokens, index, "∧")
    const next = parseClauseCNF(tokens, index)
    clauses.push(next.clause)
    index = next.index
  }
  if (index !== tokens.length) {
    throw new Error(`Unexpected token "${tokens[index]}" at position ${index}`)
  }
  return { clauses, index }
}

function parseClauseDNF(tokens, index) {
  if (peek(tokens, index) === "(") {
    index = consume(tokens, index, "(")
    const group = []

    const first = parseVariable(tokens, index)
    group.push(first.literal)
    index = first.index

    while (peek(tokens, index) === "∧") {
      index = consume(tokens, index, "∧")
      const next = parseVariable(tokens, index)
      group.push(next.literal)
      index = next.index
    }

    index = consume(tokens, index, ")")
    return { clause: group, index }
  }

  const single = parseVariable(tokens, index)
  return { clause: [single.literal], index: single.index }
}

function parseDNF(tokens, index) {
  const clauses = []

  const first = parseClauseDNF(tokens, index)
  clauses.push(first.clause)
  index = first.index

  while (peek(tokens, index) === "∨") {
    index = consume(tokens, index, "∨")
    const next = parseClauseDNF(tokens, index)
    clauses.push(next.clause)
    index = next.index
  }

  if (index !== tokens.length) {
    throw new Error(`Unexpected token "${tokens[index]}" at position ${index}`)
  }

  return { clauses, index }
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

module.exports = {
  toTokens,
  peek,
  consume,
  parseVariable,
  parseClauseCNF,
  parseCNF,
  parseClauseDNF,
  parseDNF,
}
