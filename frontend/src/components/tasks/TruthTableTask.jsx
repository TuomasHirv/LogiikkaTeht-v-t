import TruthTable from "../TruthTable"
import PreSetSubFormula from "../PreSetSubformula"

const TruthTableTask = ({ task }) => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg border border-gray-200 overflow-y-auto">
      <div className="border border-black bg-gray-500 p-3">
        <PreSetSubFormula text={task.question} />
      </div>
      <div className="py-2 pr-16 pb-12">
        <TruthTable task={task} start={task.metadata.start} />
      </div>
    </div>
  )
}

export default TruthTableTask
