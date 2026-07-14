// this file is AI generated
import { Fragment } from "react"
const SimpleMarkdown = ({ children }) => {
  const lines = children.split("\n")

  const renderBold = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    )
  }

  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {renderBold(line)}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  )
}

export default SimpleMarkdown
