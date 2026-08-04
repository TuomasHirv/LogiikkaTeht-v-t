import axios from "axios"
import useUserStore from "../store"
import { API_BASE_URL } from "../constants"
import { useUserActions } from "../store"
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})
apiClient.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    const { logoutUser } = useUserActions()
    if (
      error.response?.status === 403 &&
      error.response?.data?.error === "bad token"
    ) {
      console.log("Token is expired user logged out")
      logoutUser()
    }
    return Promise.reject(error)
  },
)

export default apiClient
