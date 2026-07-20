import { UseField } from "../hooks"

const TextField = ({ onLock }) => {
  const { reset: reset, ...textInput } = UseField("text")

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

const SemanticTreeNode = ({ node, onChange, editable = true }) => {
  if (!node.locked) {
    return (
      <TextField
        onLock={(value) => onChange({ ...node, text: value, locked: true })}
      />
    )
  }
  const hasXChild = (node) => {
    return (
      node.children?.some(
        (child) => child.text?.trim().toUpperCase() === "X",
      ) ?? false
    )
  }
  const addChild = () => {
    if (node.children) {
      onChange({
        ...node,
        children: [
          ...node.children,
          { text: "", locked: false, children: null },
        ],
      })
      return
    }
    onChange({
      ...node,
      children: [{ text: "", locked: false, children: null }],
    })
  }
  const openNode = () => {
    onChange({
      ...node,
      locked: false,
    })
  }
  if (node?.text?.trim().toUpperCase() === "X") {
    return <p className="text-red-600 bg-gray-400 rounded px-2 ">X</p>
  }
  return (
    <div>
      <div className="flex flex-col items-center w-full">
        {editable ? (
          <button
            onClick={openNode}
            className="bg-white hover:bg-gray-400 rounded text-2xl w-full text-center"
          >
            {node.text}
          </button>
        ) : (
          <p className="bg-white rounded text-2xl w-full text-center">
            {node.text}
          </p>
        )}

        {(!node.children || node.children.length < 2) && !hasXChild(node) && (
          <button
            onClick={addChild}
            className="bg-green-700 hover:bg-green-400 rounded w-full h-3 flex items-center justify-center"
          >
            +
          </button>
        )}
      </div>{" "}
      {node.children && (
        <div className="flex gap-4 items-start">
          {" "}
          {node.children.map((child, index) => (
            <SemanticTreeNode
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

export default SemanticTreeNode
