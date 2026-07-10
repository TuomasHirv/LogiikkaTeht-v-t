import { create } from "zustand"
import { persist } from "zustand/middleware"
import { answerService } from "./services/answerService"
import { userService } from "./services/userService"

const normalizeSubmittedAnswer = (submittedAnswer) => {
  if (typeof submittedAnswer !== "string") {
    return submittedAnswer
  }

  try {
    return JSON.parse(submittedAnswer)
  } catch {
    return submittedAnswer
  }
}

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      answers: {},
      actions: {
        loginUser: async (username, password) => {
          try {
            const data = await userService.login(username, password)
            set(() => ({ user: data.user, token: data.token }))
          } catch (error) {
            console.log("Error when logging in:", error.message)
          }
        },
        registerUser: async (username, password) => {
          try {
            const data = await userService.register(username, password)
            set(() => ({ user: data.user, token: data.token }))
          } catch (error) {
            console.log("Error when logging in:", error.message)
          }
        },
        logoutUser: () =>
          set(() => ({ user: null, completedTasks: [], answers: {} })),

        addAnswer: (taskId, answerText, isCorrect, moduleName) => {
          set((state) => ({
            answers: {
              ...state.answers,
              [taskId]: {
                submitted_answer: answerText,
                is_correct: isCorrect,
                module_name: moduleName,
              },
            },
          }))
        },

        initialize: async () => {
          try {
            const currentToken = get().token
            const responseData = await answerService.getAll()

            const mappedAnswers = {}

            responseData.answerList.forEach((a) => {
              mappedAnswers[a.task_id] = {
                submitted_answer: normalizeSubmittedAnswer(a.submitted_answer),
                is_correct: a.is_correct,
                module_name: a.module_name,
              }
            })
            set(() => ({ answers: mappedAnswers }))
          } catch (error) {
            console.log("Error storing answers:", error)
          }
        },
      },
    }),
    {
      name: "logic-app-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)
export default useUserStore
export const useUserActions = () => useUserStore((state) => state.actions)
