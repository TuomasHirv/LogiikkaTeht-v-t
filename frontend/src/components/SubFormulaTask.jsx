import { useEffect, useState } from "react"
import Node from "./Node"
import { answerService } from "../services/answerService"
import useUserStore, { useUserActions } from "../store"

const SubFormulaTask = ({ task }) => {
  const { addAnswer } = useUserActions()
  const savedAnswer = useUserStore((state) => state.answers[task.id])
  const [feedback, setFeedback] = useState(null)
  const [root, setRoot] = useState({
    text: task.question,
    locked: true,
    children: null,
  })

  useEffect(() => {
    const lastSavedAnswer = savedAnswer?.submitted_answer
    if (!savedAnswer || !lastSavedAnswer) {
      return
    }

    let parsedAnswer = lastSavedAnswer
    if (typeof lastSavedAnswer === "string") {
      if (lastSavedAnswer.trim() === "[object Object]") {
        return
      }
      try {
        parsedAnswer = JSON.parse(lastSavedAnswer)
      } catch {
        parsedAnswer = { text: lastSavedAnswer, locked: true, children: null }
      }
    }

    setFeedback({
      correct: savedAnswer.is_correct,
      text: savedAnswer.is_correct ? "Pass" : "Fail",
    })
    setRoot(JSON.parse(JSON.stringify(parsedAnswer)))
  }, [task.id, savedAnswer])

  const submitAnswer = async (event) => {
    event?.preventDefault()
    try {
      const responseData = await answerService.submit(task.id, root)
      addAnswer(task.id, root, responseData.correct)
      setFeedback({
        correct: responseData.correct,
        text: responseData.correct ? "Pass" : "Fail",
      })
    } catch (error) {
      console.log("Failed to submit answer:", error.message)

      if (error.response && error.response.status === 422) {
        setFeedback({
          correct: false,
          text: "Error in syntax",
        })
      } else {
        setFeedback({
          correct: false,
          text: "Server failed to evaluate answer",
        })
      }
    }
  }

  return (
    <>
      <div className="text-black text-center w-fit mx-auto">
        <Node node={root} onChange={setRoot} />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="border-black border-2 rounded bg-green-400 hover:bg-green-700 ml-3.5"
          onClick={submitAnswer}
        >
          Submit answer
        </button>
      </div>
      {feedback && (
        <p
          style={{
            color: feedback.text.includes("Pass") ? "#16a34a" : "#dc2626",
            fontSize: "1.4rem",
          }}
        >
          {feedback.text} {feedback.text.includes("Pass") ? " ✓ " : " ✗ "}
        </p>
      )}
    </>
  )
}

export default SubFormulaTask
