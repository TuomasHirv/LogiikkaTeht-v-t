import { useState } from "react"
import { useUserActions } from "../store"
import { useSimpleField } from "../hooks"
import Feedback from "./AnswerFeedback"

const RegisterScreen = () => {
  const { registerUser } = useUserActions()
  const [feedback, setFeedback] = useState({})
  const username = useSimpleField("text")
  const password = useSimpleField("password")

  const registerFunc = async (event) => {
    event.preventDefault()

    if (!username.inputProps.value || !password.inputProps.value) {
      return
    }
    if (username.inputProps.value.length < 6) {
      setFeedback({
        correct: false,
        feedback: "Username has to be atleast 6 characters long",
      })
      return
    }
    if (password.inputProps.value.length < 6) {
      setFeedback({
        correct: false,
        feedback: "password has to be atleast 6 characters long",
      })
      return
    }

    await registerUser(username.inputProps.value, password.inputProps.value)
    username.reset()
    password.reset()
  }
  return (
    <>
      <h2 className="bg-white rounded w-fit text-5xl ml-8 mt-2 text-black pb-2">
        Register
      </h2>
      <div className="bg-white rounded border-black border-2 center justify-center max-w-80 min-h-40 ml-8 mt-6">
        <form onSubmit={registerFunc} className="">
          <p className="text-black text-2xl">Username</p>
          <input {...username.inputProps} className="bg-gray-300 text-black" />
          <p className="text-black text-2xl">Password</p>
          <input {...password.inputProps} className="bg-gray-300 text-black" />
          <button
            type="submit"
            className="border-black border-2 rounded hover:bg-green-700 text-black w-fit ml-63 mt-4"
          >
            {" "}
            Register{" "}
          </button>
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

export default RegisterScreen
