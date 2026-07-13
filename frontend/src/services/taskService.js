import apiClient from "./client"

export const taskService = {
  getCount: async () => {
    const response = await apiClient.get("/tasks/count")
    console.log(response)
    return response.data
  },
  getTasks: async (moduleName) => {
    const response = await apiClient.get(`/tasks/${moduleName}`)
    return response.data
  },
}
