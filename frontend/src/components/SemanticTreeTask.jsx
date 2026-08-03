import { useState } from "react"
import SemanticTreeNode from "./SemanticTreeNode"
import { submitTaskAnswer } from "../hooks/submitAnswer"
import { useLastSavedAnswer } from "../hooks/useTaskHooks"
import AnswerFeedback from "./AnswerFeedback"
import useUserStore, { useUserActions } from "../store"

const SemanticTreeTask = ({ task, showSubmitButton = true }) => {
  const { addAnswer } = useUserActions()
  const savedAnswer = useUserStore((state) => state.answers[task.id])
  const user = useUserStore((state) => state.user)
  const [feedback, setFeedback] = useState(null)
  const createInitialRoot = () => ({
    text: task.question,
    locked: true,
    children: null,
  })
  const [root, setRoot] = useState({
    text: task.question,
    locked: true,
    children: null,
  })
  const parseAnswer = (x) => x
  useLastSavedAnswer({
    task,
    savedAnswer,
    currAnswer: root,
    setFeedback,
    applyAnswer: setRoot,
    parseAnswer,
  })

  const submitAnswer = async (event) => {
    await submitTaskAnswer({
      event,
      taskId: task.id,
      submittedAnswer: root,
      addAnswer,
      setFeedback,
    })
  }
  const resetRoot = () => {
    setRoot(createInitialRoot())
    setFeedback(null)
  }

  return (
    <>
      <div className="text-black text-center w-fit mx-auto">
        <SemanticTreeNode node={root} onChange={setRoot} editable={false} />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="border-black border-2 text-black rounded bg-red-200 hover:bg-red-700 ml-3.5"
          onClick={resetRoot}
        >
          Reset
        </button>
        {user && showSubmitButton && (
          <button
            type="button"
            className="border-black border-2 text-black rounded bg-green-400 hover:bg-green-700 ml-3.5"
            onClick={submitAnswer}
          >
            Submit answer
          </button>
        )}
      </div>
      <AnswerFeedback feedback={feedback} />
    </>
  )
}

export default SemanticTreeTask
