// This file is AI-coded, but it is important to note it also took alot of manual work

function stripOuterParens(text) {
  let stripped = text.replace(/\s*/, "")
  while (stripped.startsWith("(") && stripped.endsWith(")")) {
    let depth = 0
    let matches = true
    for (let i = 0; i < stripped.length - 1; i++) {
      if (stripped[i] === "(") depth++
      if (stripped[i] === ")") depth--
      if (depth === 0) {
        matches = false
        break
      }
    }
    if (!matches) break
    stripped = stripped.slice(1, -1)
  }
  return stripped
}

function connectiveName(symbol) {
  return { "∧": "AND", "∨": "OR", "→": "IMPLIES", "↔": "BICOND" }[symbol]
}

function findMainConnective(text) {
  const stripped = stripOuterParens(text)

  const connectives = ["↔", "→", "∨", "∧"]
  let depth = 0
  for (let i = 0; i < stripped.length; i++) {
    const char = stripped[i]
    if (char === "(") depth++
    if (char === ")") depth--
    if (depth === 0 && connectives.includes(char)) {
      return {
        type: connectiveName(char),
        left: stripped.slice(0, i).trim(),
        right: stripped.slice(i + 1).trim(),
      }
    }
  }
  if (stripped.startsWith("¬")) {
    return { type: "NOT", inner: stripped.slice(1) }
  }
  return { type: "VAR", value: stripped }
}

// TODO: stripOuterParens runs before the negation check, so negating an
// already-parenthesized compound (e.g. "(P ∧ Q)") drops the parens instead
// of producing "¬(P ∧ Q)". Not currently hit by any seeded question (every
// operand passed here today is a bare variable) — needs re-wrapping
// semantics decided before fixing.
function negateText(text) {
  const stripped = stripOuterParens(text)
  return stripped.startsWith("¬") ? stripped.slice(1) : `¬${stripped}`
}

function expandNegation(innerText) {
  const parsed = findMainConnective(innerText)
  switch (parsed.type) {
    case "NOT":
      return { kind: "chain", results: [parsed.inner] }
    case "AND":
      return {
        kind: "fork",
        results: [negateText(parsed.left), negateText(parsed.right)],
      }
    case "OR":
      return {
        kind: "chain",
        results: [negateText(parsed.left), negateText(parsed.right)],
      }
    case "IMPLIES":
      return { kind: "chain", results: [parsed.left, negateText(parsed.right)] }
    case "BICOND":
      return {
        kind: "fork",
        results: [
          `${parsed.left} ∧ ${negateText(parsed.right)}`,
          `${negateText(parsed.left)} ∧ ${parsed.right}`,
        ],
      }
    case "VAR":
      return null
  }
}

function expandObligation(text) {
  const parsed = findMainConnective(text)

  switch (parsed.type) {
    case "AND": {
      const deeperResults = [
        ...searchMoreAnd(parsed.left),
        ...searchMoreAnd(parsed.right),
      ]
      return { kind: "chain", results: deeperResults }
    }
    case "OR":
      return { kind: "fork", results: [parsed.left, parsed.right] }
    case "IMPLIES":
      return { kind: "fork", results: [negateText(parsed.left), parsed.right] }
    case "BICOND":
      return {
        kind: "fork",
        results: [
          `${parsed.left} ∧ ${parsed.right}`,
          `${negateText(parsed.left)} ∧ ${negateText(parsed.right)}`,
        ],
      }
    case "NOT":
      return expandNegation(parsed.inner)
    case "VAR":
      return null
  }
}

function searchMoreAnd(text) {
  const searchable = normalize(text)
  let matches = false
  if (searchable.startsWith("(") && searchable.endsWith(")")) {
    let depth = 0
    matches = true
    for (let i = 0; i < searchable.length - 1; i++) {
      if (searchable[i] === "(") depth++
      if (searchable[i] === ")") depth--
      if (depth === 0) {
        matches = false
        break
      }
    }
  }
  if (matches) {
    return [text]
  }
  let depth = 0
  let isAndStatement = false
  let rightSide = ""
  let leftSide = ""
  for (let j = 0; j < searchable.length - 1; j++) {
    const char = searchable[j]
    if (char === "(") depth++
    if (char === ")") depth--
    if (depth === 0) {
      if (char === "∧") {
        isAndStatement = true
        leftSide = searchable.slice(0, j)
        rightSide = searchable.slice(j + 1)
        break
      }
    }
  }
  if (!isAndStatement) {
    return [text]
  }
  return [normalize(leftSide), normalize(rightSide)]
}

function withAdded(set, item) {
  return new Set([...set, normalize(item)])
}

function withAddedAll(set, items) {
  return new Set([...set, ...items.map(normalize)])
}

function withRemoved(set, item) {
  const target = normalize(item)
  return new Set([...set].filter((x) => x !== target))
}
function negateOf(literal) {
  return literal.startsWith("¬") ? literal.slice(1) : "¬" + literal
}

function findContradiction(literals) {
  for (const lit of literals) {
    const complement = negateOf(lit)
    if (literals.has(complement)) {
      return new Set([lit, complement])
    }
  }
  return null
}

function normalize(text) {
  return text.trim().replace(/\s+/g, " ")
}

function evaluateNode(node, state, branches) {
  const currText = normalize(node.text)
  if (currText === "X") {
    const contradiction = findContradiction(state.literals)
    if (!contradiction) {
      throw new Error(
        "X was written, but no contradiction is present on this branch",
      )
    }
    branches.push({ closed: true, literals: state.literals })
    return
  }

  if (!state.pending.has(currText)) {
    throw new Error(
      `"${currText}" doesn't match anything currently pending on this branch`,
    )
  }

  const remainingPending = withRemoved(state.pending, currText)
  const obligation = expandObligation(currText)
  // --- atomic literal (VAR or bare negated VAR) ---
  if (obligation === null) {
    const newLiterals = withAdded(state.literals, currText)
    const nextState = { pending: remainingPending, literals: newLiterals }

    if (!node.children || node.children.length === 0) {
      if (remainingPending.size > 0) {
        throw new Error("Branch ended before exhausting everything pending")
      }
      if (findContradiction(newLiterals)) {
        throw new Error("Mark contradictions with X")
      }
      branches.push({ closed: false, literals: newLiterals })
      return
    }

    if (node.children.length !== 1) {
      throw new Error(
        "A literal can only chain to exactly one following line (or none, if it ends the branch)",
      )
    }

    evaluateNode(node.children[0], nextState, branches)
    return
  }

  // --- chain: both results become pending on the SAME branch, addressed in any order ---
  if (obligation.kind === "chain") {
    if (!node.children || node.children.length !== 1) {
      throw new Error(
        "A chain-type obligation (∧, ¬∨, ¬→, ¬¬) must continue with exactly one line",
      )
    }
    const nextPending = withAddedAll(remainingPending, obligation.results)
    evaluateNode(
      node.children[0],
      { pending: nextPending, literals: state.literals },
      branches,
    )
    return
  }

  // --- fork: two separate branches, each pursuing exactly one of the two results ---
  if (obligation.kind === "fork") {
    if (!node.children || node.children.length !== 2) {
      throw new Error(
        "A fork-type obligation (∨, →, ↔, ¬∧, ¬↔) must split into exactly two lines",
      )
    }

    const [child0, child1] = node.children
    const [r0, r1] = obligation.results

    let assignment
    if (child0.text === r0 && child1.text === r1) {
      assignment = [r0, r1]
    } else if (child0.text === r1 && child1.text === r0) {
      assignment = [r1, r0]
    } else {
      throw new Error(
        `Fork children don't match the expected results: expected "${r0}" and "${r1}", got "${child0.text}" and "${child1.text}"`,
      )
    }

    evaluateNode(
      child0,
      {
        pending: withAdded(remainingPending, assignment[0]),
        literals: state.literals,
      },
      branches,
    )
    evaluateNode(
      child1,
      {
        pending: withAdded(remainingPending, assignment[1]),
        literals: state.literals,
      },
      branches,
    )
    return
  }

  throw new Error(`Unrecognized obligation kind: ${obligation.kind}`)
}

// --- entry point ---

function validateSemanticTree(rootNode, question) {
  const branches = []
  const initialState = {
    pending: new Set([normalize(question)]),
    literals: new Set(),
  }
  evaluateNode(rootNode, initialState, branches)
  return branches
}

module.exports = {
  validateSemanticTree,
  stripOuterParens,
  findMainConnective,
  expandNegation,
  expandObligation,
  searchMoreAnd,
  findContradiction,
  evaluateNode,
}
