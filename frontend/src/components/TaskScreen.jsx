import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"

const TaskScreen = () => {
  const { moduleName } = useParams()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
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
        console.log(response.status)
        const data = await response.json()
        console.log(data)
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
  return (
    <div>
      {tasks.map((task, index) => (
        <div>
          <h3>Question {index}</h3> <p>{task.question}</p>
        </div>
      ))}{" "}
    </div>
  )
}

export default TaskScreen
