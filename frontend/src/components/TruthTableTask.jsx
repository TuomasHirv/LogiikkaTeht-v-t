import TruthTable from "./TruthTable"
import PreSetSubFormula from "./PreSetSubformula"

const TruthTableTask = () => {
  const proposition = "(P ∧ Q) ∨ P"
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
      <div className="border border-black bg-gray-500 p-3">
        <PreSetSubFormula text={proposition} />
      </div>
      <div className="py-2">
        <TruthTable />
      </div>
    </div>
  )
}

export default TruthTableTask
