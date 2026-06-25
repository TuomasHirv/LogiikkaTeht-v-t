import apiClient from "./client"

export const userService = {
  login: async (username, password) => {
    const response = await apiClient.post("/users/login", {
      username,
      password,
    })
    return response.data
  },

  register: async (username, password) => {
    const response = await apiClient.post("/users", {
      username,
      password,
    })

    return response.data
  },
}
