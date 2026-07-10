import { useState, useEffect } from "react"

export const UseField = (type, initValue = "") => {
  const [value, setValue] = useState(initValue || "")
  useEffect(() => {
    setValue(initValue || "")
  }, [initValue])

  const processInput = (input) => {
    return input
      .replace(/\band\b(\s+)/gi, "∧ ")
      .replace(/\bor\b(\s+)/gi, "∨ ")
      .replace(/\bnot\b/gi, "¬")
      .replace(/\bimply\b(\s+)/gi, "→ ")

      .replace(/\bja\b(\s+)/gi, "∧ ")
      .replace(/\btai\b(\s+)/gi, "∨ ")
      .replace(/\bei\b/gi, "¬")
      .replace(/\bsiis\b(\s+)/gi, "→ ")
      .replace(/<->(\s+)/g, "↔ ")
      .replace(/->(\s+)/g, "→ ")
      .replace(/\{\s*\}/g, "∅")
  }
  const onChange = (event) => {
    const processedText = processInput(event.target.value)
    setValue(processedText)
  }

  const reset = () => {
    setValue("")
  }

  return {
    type,
    value,
    onChange,
    reset,
  }
}

export const UseResolutionField = (type, initValue = "") => {
  const [value, setValue] = useState(initValue || "")
  const [syntaxError, setSyntaxError] = useState("")
  useEffect(() => {
    setValue(initValue || "")
  }, [initValue])

  const checkSyntax = (input, index) => {
    const trimmed = input.trim()
    if (trimmed === "") {
      setSyntaxError("")
      return
    }

    const clausePattern = /∅|\{\s*¬?[A-Za-z](\s*,\s*¬?[A-Za-z])*\s*\}/
    const justificationPattern =
      /\(\s*assumption\s*\)|\(\s*lines:\s*\d+\s*,\s*\d+\s*\)/

    const fullPattern = new RegExp(
      `^(${clausePattern.source})\\s*(${justificationPattern.source})$`,
    )

    const match = trimmed.match(fullPattern)
    if (!match) {
      setSyntaxError(
        "Expected format: {literals} (assumption) or {literals} (lines: X, Y)",
      )
      return
    }

    const clausePart = match[1]
    const justificationPart = trimmed.slice(clausePart.length).trim()

    if (clausePart === "∅" && /assumption/.test(justificationPart)) {
      setSyntaxError("∅ can never be an assumption")
      return
    }
    const lineNumbers = justificationPart.match(/\d+/g)
    if (lineNumbers) {
      const referenced = lineNumbers.map(Number)
      const tooHigh = referenced.some((n) => n >= index)
      if (tooHigh) {
        setSyntaxError("Cant reference the current line or later lines")
        return
      }
    }

    setSyntaxError("")
  }
  const processInput = (input) => {
    return input
      .replace(/\bnot\b/gi, "¬")
      .replace(/\bei\b/gi, "¬")
      .replace(/\{\s*\}/g, "∅")
  }
  const onChange = (event) => {
    const processedText = processInput(event.target.value)
    setValue(processedText)
  }

  const reset = () => {
    setValue("")
  }

  return {
    type,
    value,
    onChange,
    reset,
    syntaxError,
    checkSyntax,
  }
}

export const UseSimpleField = (type) => {
  const [value, setValue] = useState("")

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue("")
  }

  return {
    type,
    value,
    onChange,
    reset,
  }
}
