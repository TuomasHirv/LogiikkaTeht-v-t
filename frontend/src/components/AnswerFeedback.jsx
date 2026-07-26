const AnswerFeedback = ({ feedback }) => {
  if (!feedback) {
    return null
  }
  return (
    <p
      className={`text-2xl ${feedback.correct ? "text-green-600" : "text-red-600"} bg-gray-800 rounded w-fit`}
    >
      {feedback.feedback} {feedback.correct ? " ✓ " : " ✗ "}
    </p>
  )
}

export default AnswerFeedback
