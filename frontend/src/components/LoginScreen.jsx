import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserActions } from "../store"
import { useSimpleField } from "../hooks"
import Feedback from "./AnswerFeedback"

const LoginScreen = () => {
  const navigate = useNavigate()
  const { loginUser } = useUserActions()
  const [feedback, setFeedback] = useState({})
  const username = useSimpleField("text")
  const password = useSimpleField("password")

  const loginFunc = async (event) => {
    event.preventDefault()

    if (!username.inputProps.value || !password.inputProps.value) {
      return
    }
    if (username.inputProps.value.length < 6) {
      setFeedback({
        correct: false,
        feedback: "Username is always atleast 6 characters long",
      })
      return
    }
    if (password.inputProps.value.length < 6) {
      setFeedback({
        correct: false,
        feedback: "password is always atleast 6 characters long",
      })
      return
    }

    const response = await loginUser(
      username.inputProps.value,
      password.inputProps.value,
    )
    if (response.success) {
      navigate("/")
      username.reset()
      password.reset()
    } else {
      setFeedback({ correct: false, feedback: response.error })
    }
  }
  return (
    <>
      <h2 className="bg-white rounded w-fit text-5xl ml-8 mt-2 text-black pb-2">
        Login
      </h2>
      <div className="bg-white rounded border-black border-2 center justify-center max-w-80 min-h-40 ml-8 mt-6">
        <form onSubmit={loginFunc}>
          <p className="text-black text-2xl">Username</p>
          <input {...username.inputProps} className="bg-gray-300 text-black" />
          <p className="text-black text-2xl">Password</p>
          <input {...password.inputProps} className="bg-gray-300 text-black" />
          <div className="border-black border-2 rounded hover:bg-green-700 text-black w-fit ml-65 mt-4">
            <button type="submit"> Log in </button>
          </div>
        </form>
        {feedback?.feedback && (
          <div>
            <Feedback feedback={feedback} />
          </div>
        )}
      </div>
    </>
  )
}

export default LoginScreen
