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

const validateResolutionSyntax = (input, index) => {
  const trimmed = input.trim()
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

  const clausePart = match[1]
  const justificationPart = trimmed.slice(clausePart.length).trim()

  if (clausePart === "∅" && /assumption/.test(justificationPart)) {
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

export const useSimpleField = (type) =>
  useTextField(type, "", { trackInitValue: false })
