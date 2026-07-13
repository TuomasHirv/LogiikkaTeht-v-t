import { useState } from "react"

export const useLineList = (initial, { min = 1, max = 10 } = {}) => {
  const [lines, setLines] = useState(initial)

  const change = (text, i) =>
    setLines((prev) =>
      prev[i] === text ? prev : prev.map((v, idx) => (idx === i ? text : v)),
    )

  const addRemove = (add) =>
    setLines((prev) => {
      if (add) return prev.length < max ? [...prev, ""] : prev
      return prev.length > min ? prev.slice(0, -1) : prev
    })

  return { lines, setLines, change, addRemove }
}
