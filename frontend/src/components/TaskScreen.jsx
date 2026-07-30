import { useParams, Link } from "react-router-dom"
import { useState, useEffect, lazy, Suspense } from "react"
import { taskInstructions } from "../content/taskInstructions"
import { ROUTES, MODULE_NAMES } from "../constants"

import { taskService } from "../services/taskService"
const TaskItem = lazy(() => import("./TaskItem"))
const SubFormulaTask = lazy(() => import("./SubFormulaTask"))
const TruthTableTask = lazy(() => import("./TruthTableTask"))
const EliminationTask = lazy(() => import("./EliminationTask"))
const NormalFormTask = lazy(() => import("./NormalFormTask"))
const ResolutionTask = lazy(() => import("./ResolutionTask"))
const ShorthandTask = lazy(() => import("./ShorthandTask"))
const SemanticTreeTask = lazy(() => import("./SemanticTreeTask"))
const MultipleChoiseTask = lazy(() => import("./MultipleChoiseTask"))
const NaturalDeductionTask = lazy(() => import("./NaturalDeductionTask"))

const TaskScreen = () => {
  const { moduleName, id, section } = useParams()
  const nextSection = Number(section) + 1
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [continued, setContinued] = useState(false)
  useEffect(() => {
    setContinued(false)
    import(`../content/instructions/part${id}section${section}.js`)
      .then(() => setContinued(true))
      .catch(() => setContinued(false))

    const nextSection = Number(section) + 1
    import(`../content/instructions/part${id}section${nextSection}.js`).catch(
      () => {},
    )
  }, [id, section])

  const instructionLink = ROUTES.instructions(id, nextSection)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const data = await taskService.getTasks(moduleName)
        setTasks(data)
      } catch (err) {
        console.log("Failed to fetch tasks:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [moduleName])
  if (loading) {
    return <h1>Module: {moduleName} </h1>
  }
  const getTaskComponent = () => {
    switch (moduleName) {
      case MODULE_NAMES.WORDS_TO_PROPOSITIONS:
        return TaskItem
      case MODULE_NAMES.TRUTH_TABLE_TASK:
        return TruthTableTask
      case MODULE_NAMES.SUBFORMULA:
        return SubFormulaTask
      case MODULE_NAMES.EQUIVALENCE_RULES_TASK:
        return EliminationTask
      case MODULE_NAMES.EQUIVALENCE_METHOD_TRANSFORM:
        return EliminationTask
      case MODULE_NAMES.TT_METHOD_CONVERSION:
        return NormalFormTask
      case MODULE_NAMES.RESOLUTION_INTRODUCTION:
        return ResolutionTask
      case MODULE_NAMES.RESOLUTION_REFUTATION:
        return ResolutionTask
      case MODULE_NAMES.SHORTHAND_TASK:
        return ShorthandTask
      case MODULE_NAMES.SEMANTIC_TREE_INTRO:
        return SemanticTreeTask
      case MODULE_NAMES.MULTIPLE_CHOISE_NATURAL_DEDUCTION:
        return MultipleChoiseTask
      case MODULE_NAMES.ASSUMPTIONS_AND_DISCHARGE_NATURAL_DEDUCTION:
      case MODULE_NAMES.BASIC_RULES_NATURAL_DEDUCTION:
        return NaturalDeductionTask
      default:
        return TaskItem
    }
  }

  const TaskComponent = getTaskComponent()
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
      <h2 className="bg-white rounded text-black w-fit text-4xl">
        {moduleName}
      </h2>

      <p className="text-black w-fit text-xl border-2 border-dotted">
        {taskInstructions[moduleName]?.instruction ?? "No instructions found."}
      </p>

      {tasks.map((task, index) => (
        <div
          key={task.id || index}
          className={
            moduleName === "Truth-Table-Task" ||
            moduleName === "Normal-Forms-Task"
              ? ""
              : "bg-gray-500 p-3 border-black border-2"
          }
        >
          <Suspense
            fallback={<div className="text-black">Loading task...</div>}
          >
            <TaskComponent task={task} />
          </Suspense>
        </div>
      ))}

      {continued && (
        <Link
          to={instructionLink}
          className="bg-green-950 hover:bg-green-700 rounded shadow buttonStyle mt-6 inline-block text-2xl"
        >
          Next section
        </Link>
      )}
    </div>
  )
}

export default TaskScreen
