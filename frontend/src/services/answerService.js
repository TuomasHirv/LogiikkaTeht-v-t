import apiClient from "./client"

export const answerService = {
  getAll: async () => {
    const response = await apiClient.get("/answers")
    return response.data
  },
  submit: async (taskId, answerText) => {
    const response = await apiClient.post(`/answers/${taskId}`, {
      answer: answerText,
    })
    return response.data
  },
}
