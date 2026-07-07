import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { partInstructions } from "../content/partInstructions"
import { taskInstructions } from "../content/taskInstructions"

import TaskItem from "./TaskItem"
import SubFormulaTask from "./SubFormulaTask"
import TruthTableTask from "./TruthTableTask"
import EliminationTask from "./EliminationTask"
import NormalFormTask, { PRESET_NORMAL_FORM_TASK } from "./NormalFormTask"
const TaskScreen = () => {
  const { moduleName, id, section } = useParams()
  const nextSection = Number(section) + 1
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [continued, setContinued] = useState(false)
  if (partInstructions[id][section] && !continued) {
    setContinued(true)
  }
  const instructionLink = `http://localhost:5173/part/${id}/section/${nextSection}`
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `http://localhost:5000/api/tasks/${moduleName}`,
        )
        if (!response.ok) {
          throw new Error("Couldn't fetch tasks")
        }
        const data = await response.json()
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

  const presetTasksByModule = {
    "Normal-Forms-Task": [PRESET_NORMAL_FORM_TASK],
  }
  const tasksToRender = tasks.length
    ? tasks
    : (presetTasksByModule[moduleName] ?? [])

  const getTaskComponent = () => {
    switch (moduleName) {
      case "words-to-propositions":
        return TaskItem
      case "Truth-Table-Task":
        return TruthTableTask
      case "subformula":
        return SubFormulaTask
      case "Equivalence-Rules-Task":
        return EliminationTask
      case "Normal-Forms-Task":
        return NormalFormTask
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

      {tasksToRender.map((task, index) => (
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
