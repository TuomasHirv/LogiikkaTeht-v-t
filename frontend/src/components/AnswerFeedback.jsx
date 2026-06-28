const AnswerFeedback = ({ feedback }) => {
  if (!feedback) {
    return null
  }

  return (
    <p
      style={{
        color: feedback.correct ? "#16a34a" : "#dc2626",
        fontSize: "1.4rem",
      }}
    >
      {feedback.text} {feedback.correct ? " ✓ " : " ✗ "}
    </p>
  )
}

export default AnswerFeedback
