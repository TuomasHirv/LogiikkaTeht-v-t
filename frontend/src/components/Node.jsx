import { UseField } from "../hooks"

const TextField = ({ onLock }) => {
  const { reset: reset, ...textInput } = UseField("text")

  const handleLock = (event) => {
    event.preventDefault()
    if (textInput.value.trim()) {
      onLock(textInput.value)
    }
  }
  return (
    <form onSubmit={handleLock}>
      <input {...textInput} />
      <button type="submit"> ok </button>
    </form>
  )
}

const Node = ({ node, onChange }) => {
  if (!node.locked) {
    return (
      <TextField
        onLock={(value) => onChange({ ...node, text: value, locked: true })}
      />
    )
  }
  const nodeParts = node.text.split(/([¬∧∨→↔])/)

  const handleSplit = (part) => {
    if (part === "¬") {
      onChange({
        ...node,
        children: [{ text: "", locked: false, children: null }],
      })
    } else {
      onChange({
        ...node,
        children: [
          { text: "", locked: false, children: null },
          { text: "", locked: false, children: null },
        ],
      })
    }
  }
  return (
    <div>
      <p
        style={{
          backgroundColor: "#e5e5e5",
          padding: "0.1rem 0.2rem",
          borderRadius: "6px",
          margin: 2,
        }}
      >
        {!node.children
          ? nodeParts.map((part, index) =>
              /[¬∧∨→↔]/.test(part) ? (
                <button key={index} onClick={() => handleSplit(part)}>
                  {part}
                </button>
              ) : (
                part
              ),
            )
          : node.text}
      </p>
      {node.children && (
        <div style={{ display: "flex", gap: "1rem" }}>
          {node.children.map((child, index) => (
            <Node
              key={index}
              node={child}
              onChange={(updatedChild) => {
                const newChildren = node.children.map((c, i) =>
                  i === index ? updatedChild : c,
                )
                onChange({ ...node, children: newChildren })
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Node
