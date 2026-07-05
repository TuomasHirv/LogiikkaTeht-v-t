export const createPassFailFeedback = (isCorrect) => ({
  correct: isCorrect,
  text: isCorrect ? "Pass" : "Fail",
})

export const buildSavedAnswerFeedback = (savedAnswer) => {
  if (!savedAnswer) {
    return null
  }
  return createPassFailFeedback(savedAnswer.is_correct)
}

export const parseSavedSubFormulaAnswer = (submittedAnswer) => {
  if (!submittedAnswer) {
    return null
  }

  let parsedAnswer = submittedAnswer
  if (typeof submittedAnswer === "string") {
    if (submittedAnswer.trim() === "[object Object]") {
      return null
    }

    try {
      parsedAnswer = JSON.parse(submittedAnswer)
    } catch {
      parsedAnswer = {
        text: submittedAnswer,
        locked: true,
        children: null,
      }
    }
  }

  return JSON.parse(JSON.stringify(parsedAnswer))
}

export const parseSavedEliminationAnswer = (submittedAnswer) => {
  if (!submittedAnswer) {
    return null
  }

  let parsedAnswer = submittedAnswer

  if (typeof submittedAnswer === "string") {
    try {
      parsedAnswer = JSON.parse(submittedAnswer)
    } catch {
      return null
    }
  }

  if (!Array.isArray(parsedAnswer)) {
    return null
  }

  const onlyStrings = parsedAnswer.filter((step) => typeof step === "string")
  if (onlyStrings.length === 0) {
    return null
  }

  return [...onlyStrings]
}
