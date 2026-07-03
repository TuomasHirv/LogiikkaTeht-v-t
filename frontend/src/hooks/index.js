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
