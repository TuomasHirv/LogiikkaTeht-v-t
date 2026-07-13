import useUserStore from "../store"
import { taskService } from "../services/taskService"
import { useEffect, useState } from "react"
import { MODULE_NAMES, MODULE_ORDER } from "../constants"

const UserPage = () => {
  const user = useUserStore((state) => state.user)
  const answers = useUserStore((state) => state.answers)

  const answerList = Object.values(answers)
  const [moduleTaskCount, setModuleTaskCount] = useState({})
  const [moduleNames, setModuleNames] = useState([])
  useEffect(() => {
    const getCount = async () => {
      const result = await taskService.getCount()
      console.log(result)
      const countDict = {}
      const modNames = []
      result.forEach((row) => {
        countDict[row.module_name] = Number(row.count)
        modNames.push(row.module_name)
      })
      setModuleTaskCount(countDict)
      setModuleNames(modNames)
      console.log(moduleNames, moduleTaskCount)
    }
    getCount()
  }, [])
  const counts = MODULE_ORDER.reduce((acc, moduleName) => {
    acc[moduleName] = 0
    return acc
  }, {})

  answerList.forEach((answer) => {
    const moduleName = answer.module_name
    if (!counts[moduleName]) {
      counts[moduleName] = 0
    }
    if (answer.is_correct) {
      counts[moduleName] += 1
    }
  })

  const totalCorrect = answerList.filter((a) => a.is_correct).length

  if (!user) {
    return (
      <div className="pt-28 px-8 bg-white">
        <p className="text-black">You need to be logged in to see this page.</p>
      </div>
    )
  }

  return (
    <div className="pt-10 px-8 pb-12 max-w-2xl mx-auto bg-gray-400">
      <div className="bg-white text-black rounded">
        <h1 className="text-2xl font-bold mb-1 ">{user.username}</h1>
        <p className=" mb-8 ">
          {totalCorrect} tasks answered correctly overall
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {MODULE_ORDER.map((moduleName) => {
          const correct = counts[moduleName] ?? 0
          const total = moduleTaskCount[moduleName] ?? 0
          const percent = total === 0 ? 0 : correct / total
          const isComplete = percent >= 0.8
          return (
            <div
              key={moduleName}
              className="flex items-center justify-between bg-white border-2 border-black rounded px-4 py-2"
            >
              <span
                className={`font-mono ${isComplete ? "text-green-600" : "text-black"}`}
              >
                {moduleName}
              </span>
              <span
                className={`font-mono ${isComplete ? "text-green-600" : "text-black"}`}
              >
                {`${correct} / ${total}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UserPage
