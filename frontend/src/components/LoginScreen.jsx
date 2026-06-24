import { useState } from "react"
import useUserStore, { useUserActions } from "../store"
import { UseSimpleField } from "../hooks"

const LoginScreen = () => {
  const user = useUserStore((state) => state.user)
  const { loginUser, logoutUser } = useUserActions()
  const { reset: resetUsername, ...username } = UseSimpleField("text")
  const { reset: resetPassword, ...password } = UseSimpleField("text")

  const loginFunc = async (event) => {
    event.preventDefault()

    if (!username.value || !password.value) {
      return
    }

    await loginUser(username.value, password.value)
    resetUsername()
    resetPassword()
  }
  return (
    <div>
      <form onSubmit={loginFunc}>
        <p>Username</p>
        <input {...username} />
        <p>password</p>
        <input {...password} />
        <button type="submit"> Log in </button>
      </form>
    </div>
  )
}

export default LoginScreen
