import { useState, useEffect } from "react"

const applyBaseSymbols = (input) =>
  input
    .replace(/\bnot\b/gi, "¬")
    .replace(/\bei\b/gi, "¬")
    .replace(/\{\s*\}/g, "∅")

const applyFullWordSymbols = (input) =>
  applyBaseSymbols(input)
    .replace(/\band\b(\s+)/gi, "∧ ")
    .replace(/\bor\b(\s+)/gi, "∨ ")
    .replace(/\bimply\b(\s+)/gi, "→ ")
    .replace(/\bja\b(\s+)/gi, "∧ ")
    .replace(/\btai\b(\s+)/gi, "∨ ")
    .replace(/\bsiis\b(\s+)/gi, "→ ")
    .replace(/<->(\s+)/g, "↔ ")
    .replace(/->(\s+)/g, "→ ")

const applyNaturalDeduction = (input) =>
  applyBaseSymbols(input)
    .replace(/\band\b(\s+)/gi, "∧ ")
    .replace(/\bor\b(\s+)/gi, "∨ ")
    .replace(/\bimply\b(\s+)/gi, "→ ")
    .replace(/\bja\b(\s+)/gi, "∧ ")
    .replace(/\btai\b(\s+)/gi, "∨ ")
    .replace(/\bsiis\b(\s+)/gi, "→ ")
    .replace(/<->(\s+)/g, "↔ ")
    .replace(/->(\s+)/g, "→ ")
    .replace(/\+/g, "  |")

const validateResolutionSyntax = (input, index) => {
  const trimmed = input.trim().replace(/\|/g, "")
  if (trimmed === "") return ""

  const clausePattern = /∅|\{\s*¬?[A-Za-z](\s*,\s*¬?[A-Za-z])*\s*\}/
  const justificationPattern =
    /\(\s*assumption\s*\)|\(\s*lines:\s*\d+\s*,\s*\d+\s*\)/
  const fullPattern = new RegExp(
    `^(${clausePattern.source})\\s*(${justificationPattern.source})$`,
  )

  const match = trimmed.match(fullPattern)
  if (!match) {
    return "Expected format: {literals} (assumption) or {literals} (lines: X, Y)"
  }

  const propositionPart = match[1]
  const justificationPart = trimmed.slice(propositionPart.length).trim()

  if (propositionPart === "∅" && /assumption/.test(justificationPart)) {
    return "∅ can never be an assumption"
  }

  const lineNumbers = justificationPart.match(/\d+/g)
  if (lineNumbers) {
    const referenced = lineNumbers.map(Number)
    if (referenced.some((n) => n >= index)) {
      return "Cant reference the current line or later lines"
    }
  }

  return ""
}

const validateNaturalDeductionSyntax = (input, index) => {
  const trimmed = input.trim()
  if (trimmed === "") return ""

  const propositionPattern = /[¬(]*[A-Za-z][)]*(\s*[∧∨→↔]\s*[¬(]*[A-Za-z][)]*)*/

  const justificationPattern =
    /\(\s*premise\s*\)|\(\s*assumption\s*\)|\(\s*(?:∧I|∧E|∨I|∨E|→I|→E|¬I|¬E|↔I|↔E|¬¬E)\s*,?\s*lines?:\s*\d+(?:\s*-\s*\d+)?(?:\s*,\s*\d+(?:\s*-\s*\d+)?)*\s*\)/
  const fullPattern = new RegExp(
    `^(${propositionPattern.source})\\s*(${justificationPattern.source})$`,
  )

  const match = trimmed.match(fullPattern)
  if (!match) {
    return "Expected format: proposition (premise) or proposition ('rule' 'lines: X, Y')"
  }

  const propositionPart = match[1]
  const justificationPart = trimmed.slice(propositionPart.length).trim()

  const lineNumbers = justificationPart.match(/\d+/g)
  if (lineNumbers) {
    const referenced = lineNumbers.map(Number)
    if (referenced.some((n) => n >= index)) {
      return "Can't reference the current line or later lines"
    }
    if (referenced.length > 2) {
      return "No rule expects more than 2 reference numbers"
    }
  }

  return ""
}

export const useTextField = (type, initValue = "", options = {}) => {
  const {
    transform = (input) => input,
    trackInitValue = true,
    validate = null,
  } = options

  const [value, setValue] = useState(initValue || "")
  const [syntaxError, setSyntaxError] = useState("")

  useEffect(() => {
    if (trackInitValue) {
      setValue(initValue || "")
    }
  }, [initValue, trackInitValue])

  const onChange = (event) => {
    setValue(transform(event.target.value))
  }

  const checkSyntax = (input, context) => {
    if (!validate) return
    setSyntaxError(validate(input, context))
  }

  const reset = () => {
    setValue("")
    setSyntaxError("")
  }

  return {
    inputProps: { type, value, onChange },
    reset,
    syntaxError,
    checkSyntax,
  }
}

export const useField = (type, initValue = "") =>
  useTextField(type, initValue, { transform: applyFullWordSymbols })

export const useResolutionField = (type, initValue = "") =>
  useTextField(type, initValue, {
    transform: applyBaseSymbols,
    validate: validateResolutionSyntax,
  })
export const useNaturalDeductionField = (type, initValue = "") =>
  useTextField(type, initValue, {
    transform: applyNaturalDeduction,
    validate: validateNaturalDeductionSyntax,
  })

export const useSimpleField = (type) =>
  useTextField(type, "", { trackInitValue: false })
