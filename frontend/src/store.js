import { create } from "zustand"
import { persist } from "zustand/middleware"

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      completedTasks: [],
      answers: [],
      actions: {
        loginUser: async (username, password) => {
          console.log(username, password)
          try {
            const response = await fetch(
              `http://localhost:5000/api/users/login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  username: username,
                  password: password,
                }),
              },
            )
            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.error)
            }
            const data = await response.json()
            const loggedUser = data.user
            set(() => ({ user: loggedUser }))
          } catch (error) {
            console.log("Error when logging in:", error.message)
          }
        },
        registerUser: async (username, password) => {
          console.log(username, password)
          try {
            const response = await fetch(`http://localhost:5000/api/users`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username: username, password: password }),
            })
            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.error)
            }
            const data = await response.json()
            const loggedUser = data.user
            set(() => ({ user: loggedUser }))
          } catch (error) {
            console.log("Error when registering:", error.message)
          }
        },
        logoutUser: () =>
          set(() => ({ user: null, completedTasks: [], answers: [] })),
      },
    }),
    {
      name: "logic-app-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
export default useUserStore
export const useUserActions = () => useUserStore((state) => state.actions)
