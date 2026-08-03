import {
  useField,
  useNaturalDeductionField,
  useResolutionField,
} from "../hooks"

const Line = ({
  initValue,
  index,
  change,
  validateSyntax = false,
  disableFirstLine = false,
  fieldType,
}) => {
  const field = fieldType("text", initValue, index)
  if (index === 0 && disableFirstLine) {
    return (
      <div className="flex bg-amber-100 text-black">
        <span className="inline-block w-5 text-center bg-gray-500">
          {index}:
        </span>{" "}
        {initValue}{" "}
      </div>
    )
  }
  return (
    <div className="flex bg-white text-black">
      <span className="inline-block w-5 text-center bg-gray-500">{index}:</span>

      <input
        {...field.inputProps}
        onBlur={() => {
          if (validateSyntax) {
            field.checkSyntax(field.inputProps.value, index)
          }
          if (field.inputProps.value) {
            change(field.inputProps.value, index)
          }
        }}
        className="relative w-full max-w-3xl"
      />
      {field?.syntaxError && (
        <div className="group relative">
          <span className="cursor-pointer text-red-700 bg-gray-700 select-none px-1">
            {" "}
            !{" "}
          </span>
          <p
            className="
              absolute left-0 top-full mt-1 z-10
              max-w-xs whitespace-normal
              bg-gray-700 text-white text-sm rounded px-2 py-1
              opacity-0 pointer-events-none
              group-hover:opacity-100
              transition-opacity duration-150
            "
          >
            {" "}
            {field.syntaxError}{" "}
          </p>
        </div>
      )}
    </div>
  )
}

export default Line
