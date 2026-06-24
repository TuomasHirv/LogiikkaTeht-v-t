import { useState } from "react"
import useUserStore, { useUserActions } from "../store"
import { UseSimpleField } from "../hooks"

const RegisterScreen = () => {
  const user = useUserStore((state) => state.user)
  const { loginUser, logoutUser, registerUser } = useUserActions()
  const { reset: resetUsername, ...username } = UseSimpleField("text")
  const { reset: resetPassword, ...password } = UseSimpleField("text")

  const registerFunc = async (event) => {
    event.preventDefault()

    if (!username.value || !password.value) {
      return
    }

    await registerUser(username.value, password.value)
    resetUsername()
    resetPassword()
  }
  return (
    <div>
      <form onSubmit={registerFunc}>
        <p>Username</p>
        <input {...username} />
        <p>password</p>
        <input {...password} />
        <button type="submit"> Register </button>
      </form>
    </div>
  )
}

export default RegisterScreen
