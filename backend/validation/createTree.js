// This file is AI coded
const logger = require("../config/logger")

function Node(type, value = null, children = []) {
  return { type, value, children }
}

function parse(tokens) {
  let pos = 0

  function peek() {
    return tokens[pos]
  }

  function consume() {
    return tokens[pos++]
  }

  // BICONDITIONAL (lowest precedence)
  function parseBiconditional() {
    let left = parseImplies()

    while (peek() === "<->") {
      consume()
      let right = parseImplies()
      left = Node("BICOND", null, [left, right])
    }

    return left
  }

  function parseImplies() {
    let left = parseOr()

    while (peek() === "->") {
      consume()
      let right = parseImplies()
      left = Node("IMPLIES", null, [left, right])
    }

    return left
  }

  // OR
  function parseOr() {
    let left = parseAnd()

    while (peek() === "∨") {
      consume()
      let right = parseAnd()
      left = Node("OR", null, [left, right])
    }

    return left
  }

  // AND
  function parseAnd() {
    let left = parseNot()

    while (peek() === "∧") {
      consume()
      let right = parseNot()
      left = Node("AND", null, [left, right])
    }

    return left
  }

  function parseNot() {
    if (peek() === "¬") {
      consume()
      return Node("NOT", null, [parseNot()])
    }
    return parsePrimary()
  }

  function parsePrimary() {
    if (peek() === "(") {
      consume()
      let expr = parseBiconditional()
      if (peek() !== ")") {
        throw new Error("Missing closing parenthesis")
      }
      consume()
      return expr
    }

    const token = consume()
    if (!token) {
      throw new Error("Unexpected end of input")
    }
    return Node("VAR", token)
  }

  const tree = parseBiconditional()
  if (pos !== tokens.length) {
    throw new Error("Unexpected token at position " + pos)
  }

  return tree
}

function tokenize(input) {
  const tokens = []
  let index = 0

  while (index < input.length) {
    const char = input[index]

    if (/\s/.test(char)) {
      index += 1
      continue
    }

    if (/[A-Za-z]/.test(char)) {
      tokens.push(char)
      index += 1
      continue
    }

    if (char === "↔") {
      tokens.push("<->")
      index += 1
      continue
    }

    if (char === "→") {
      tokens.push("->")
      index += 1
      continue
    }

    if (char === "¬") {
      tokens.push("¬")
      index += 1
      continue
    }

    if (char === "∧") {
      tokens.push("∧")
      index += 1
      continue
    }

    if (char === "∨") {
      tokens.push("∨")
      index += 1
      continue
    }

    if (char === "(" || char === ")") {
      tokens.push(char)
      index += 1
      continue
    }

    throw new Error("Invalid token at position " + index)
  }

  return tokens
}

function createTree(input, silent = false) {
  try {
    const tokens = tokenize(input)
    return parse(tokens)
  } catch (error) {
    if (!silent) {
      logger.error(error, "Error when creating tree")
    }
  }
}

module.exports = createTree
