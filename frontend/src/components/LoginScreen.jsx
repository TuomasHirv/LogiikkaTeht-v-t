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
    <>
      <h2 className="bg-white rounded w-fit text-5xl ml-8 mt-2 text-black pb-2">
        Login
      </h2>
      <div className="bg-white rounded border-black border-2 center justify-center max-w-80 min-h-40 ml-8 mt-6">
        <form onSubmit={loginFunc}>
          <p className="text-black text-2xl">Username</p>
          <input {...username} className="bg-gray-300 text-black" />
          <p className="text-black text-2xl">Password</p>
          <input {...password} className="bg-gray-300 text-black" />
          <div className="border-black border-2 rounded hover:bg-green-700 text-black w-fit ml-65 mt-4">
            <button type="submit"> Log in </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default LoginScreen
