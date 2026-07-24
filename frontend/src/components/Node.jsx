import { useField } from "../hooks"

const TextField = ({ onLock }) => {
  const { reset: reset, ...textInput } = useField("text")

  const handleLock = (event) => {
    event.preventDefault()
    if (textInput.inputProps.value.trim()) {
      onLock(textInput.inputProps.value)
    }
  }
  return (
    <form onSubmit={handleLock}>
      <input {...textInput.inputProps} className="bg-white" />
      <button type="submit" className="border-2 border-black rounded">
        {" "}
        ok{" "}
      </button>
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
      <p className="bg-white rounded text-2xl">
        {!node.children
          ? nodeParts.map((part, index) =>
              /[¬∧∨→↔]/.test(part) ? (
                <button
                  key={index}
                  className="bg-gray-600 hover:bg-gray-700 rounded"
                  onClick={() => handleSplit(part)}
                >
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
