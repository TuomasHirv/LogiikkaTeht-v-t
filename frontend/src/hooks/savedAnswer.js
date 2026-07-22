export const createPassFailFeedback = (isCorrect) => ({
  correct: isCorrect.correct,
  feedback: isCorrect.feedback,
})

export const buildSavedAnswerFeedback = (savedAnswer) => {
  //console.log(savedAnswer)
  if (!savedAnswer) {
    return null
  }
  return createPassFailFeedback({
    correct: savedAnswer.is_correct,
    feedback: savedAnswer.feedback,
  })
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
