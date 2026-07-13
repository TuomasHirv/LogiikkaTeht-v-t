import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { partInstructions } from "../content/partInstructions"
import { taskInstructions } from "../content/taskInstructions"
import { ROUTES, MODULE_NAMES } from "../constants"

import { taskService } from "../services/taskService"
import TaskItem from "./TaskItem"
import SubFormulaTask from "./SubFormulaTask"
import TruthTableTask from "./TruthTableTask"
import EliminationTask from "./EliminationTask"
import NormalFormTask from "./NormalFormTask"
import ResolutionTask from "./ResolutionTask"

const TaskScreen = () => {
  const { moduleName, id, section } = useParams()
  const nextSection = Number(section) + 1
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [continued, setContinued] = useState(false)
  useEffect(() => {
    if (partInstructions[id][section] && !continued) {
      setContinued(true)
    }
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
          <TaskComponent task={task} />
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
