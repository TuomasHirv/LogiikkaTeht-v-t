function toTokens(proposition, shorthandSymbols) {
  const operators = new Set(["¬", "∧", "∨", "→", "↔", "(", ")"])
  const tokens = []
  const cleaned = proposition.replace(/\s/g, "")
  let i = 0
  const len = cleaned.length
  while (i < cleaned.length) {
    const ch = cleaned[i]
    if (shorthandSymbols.includes(ch)) {
      tokens.push(ch)
      i++
      continue
    }
    if (ch === "p") {
      let curr = "p"
      i++
      while (i < len && /\d/.test(cleaned[i])) {
        curr += cleaned[i]
        i++
      }
      tokens.push(curr)
      continue
    }
    if (operators.has(ch)) {
      tokens.push(ch)
      i++
      continue
    }
    throw new Error(`Invalid character "${ch}" at position ${i}`)
  }
  return tokens
}

function validateDifference(prevTokens, currTokens, shorthands) {
  let i = 0
  let j = 0
  let transforms = 0
  while (i < prevTokens.length) {
    const prevToken = prevTokens[i]
    const currToken = currTokens[j]
    if (j >= currTokens.length) {
      throw new Error("Current tokens ended too early")
    }
    if (prevToken === currToken) {
      i++
      j++
      continue
    }
    if (prevToken in shorthands) {
      transforms++
      j = validateShorthandExpansion(shorthands[prevToken], currTokens, j)
      i++
      continue
    }
    throw new Error(`Token not in shorthands ${prevToken}`)
  }
  if (j !== currTokens.length) {
    throw new Error("currTokens was too long")
  }
  return transforms === 1 || transforms === 0
}

function validateShorthandExpansion(shorthandDefinition, currTokens, index) {
  let i = 0
  let j = index
  while (i < shorthandDefinition.length) {
    if (j >= currTokens.length) {
      throw new Error("Expansion exceeds current tokens")
    }
    if (shorthandDefinition[i] === currTokens[j]) {
      i++
      j++
      continue
    }
    throw new Error(
      `Character ${currTokens[j]} not in definition ${shorthandDefinition}`,
    )
  }
  return j
}

function validatePropositionList(userList, shorthands) {
  let i = 1
  const keys = Object.keys(shorthands)
  let last = toTokens(userList[i - 1], keys)
  while (i < userList.length) {
    const curr = toTokens(userList[i], keys)
    const accepted = validateDifference(last, curr, shorthands)
    if (!accepted) {
      return {
        accepted: false,
        feedback: `Change from ${i - 1} to ${i} not accepted`,
      }
    }
    last = curr
    i++
  }
  const excludedCorrectly = !last.some((token) => keys.includes(token))
  if (excludedCorrectly) {
    return { accepted: true, feedback: "Pass" }
  }
  return { accepted: false, feedback: "Includes symbols that arent allowed" }
}

module.exports = {
  toTokens,
  validateDifference,
  validateShorthandExpansion,
  validatePropositionList,
}
