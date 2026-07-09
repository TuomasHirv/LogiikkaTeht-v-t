function parseClauseToSet(clauseText) {
  const inner = clauseText.trim().slice(1, -1).trim()
  if (inner === "") return new Set()

  const literals = inner.split(",").map((part) => {
    const tokens = toTokens(part.trim())
    return parseVariable(tokens, 0).literal
  })

  return new Set(literals)
}
