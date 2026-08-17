import "./App.css"
import { useEffect } from "react"
import useUserStore, { useUserActions } from "./store"
import { Routes, Route } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"

import NotFound from "./components/NotFound"
import HomeScreen from "./components/HomeScreen"
import TaskScreen from "./components/TaskScreen"
import NavBar from "./components/NavBar"
import LoginScreen from "./components/user/LoginScreen"
import RegisterScreen from "./components/user/RegisterScreen"
import InstructionScreen from "./components/InstructionScreen"
import UserPage from "./components/user/UserScreen"
import ErrorScreen from "./components/ErrorScreen"

function App() {
  const token = useUserStore((state) => state.token)
  const { initialize } = useUserActions()
  useEffect(() => {
    if (token) {
      initialize()
    }
  }, [token, initialize])
  return (
    <div>
      <NavBar />
      <ErrorBoundary FallbackComponent={ErrorScreen}>
        <div style={{ paddingTop: "80px" }}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route
              path="/part/:id/section/:section/tasks/:moduleName"
              element={<TaskScreen />}
            />
            <Route
              path="/part/:id/section/:section"
              element={<InstructionScreen />}
            />
            <Route path="/userpage" element={<UserPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default App
