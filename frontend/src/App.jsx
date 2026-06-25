import "./App.css"
import { useEffect } from "react"
import { UseField } from "./hooks"
import useUserStore, { useUserActions } from "./store"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate,
} from "react-router-dom"

import NotFound from "./components/NotFound"
import HomeScreen from "./components/HomeScreen"
import TaskScreen from "./components/TaskScreen"
import NavBar from "./components/NavBar"
import LoginScreen from "./components/LoginScreen"
import RegisterScreen from "./components/RegisterScreen"
import InstructionScreen from "./components/InstructionScreen"

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
      <div style={{ paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/tasks/:moduleName" element={<TaskScreen />} />
          <Route path="/part/:id/:moduleName" element={<InstructionScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
