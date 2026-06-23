import "./App.css"
import { UseField } from "./hooks"
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
function App() {
  const { reset: reset, ...proposition } = UseField("text")
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/tasks/:moduleName" element={<TaskScreen />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
