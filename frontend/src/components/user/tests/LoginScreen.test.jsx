import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"

import LoginScreen from "../LoginScreen"
import useUserStore from "../../../store"

const navigateMock = vi.fn()

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

const initialStoreState = useUserStore.getState()

beforeEach(() => {
  useUserStore.setState(initialStoreState, true)
  vi.restoreAllMocks()
  navigateMock.mockClear()
})

describe("LoginScreen", () => {
  describe("Renders correctly", () => {
    it("renders both input fields and title", () => {
      render(<LoginScreen />)
      expect(screen.getByRole("usernameField")).toBeInTheDocument()
      expect(screen.getByRole("passwordField")).toBeInTheDocument()
      expect(screen.getByRole("title")).toBeInTheDocument()
    })
    it("Doesn't render feedback when there is none", () => {
      render(<LoginScreen />)
      expect(screen.queryByRole("feedback")).not.toBeInTheDocument()
    })
    it("Renders the submit button", () => {
      render(<LoginScreen />)
      expect(screen.getByRole("button")).toBeInTheDocument()
    })
    it("Password field is rendered with type password", () => {
      render(<LoginScreen />)
      expect(screen.getByRole("passwordField")).toHaveAttribute(
        "type",
        "password",
      )
    })
  })
  describe("Can send a request", () => {
    it("Can type in the username and password fields", async () => {
      const user = userEvent.setup()
      render(<LoginScreen />)
      const usernameField = screen.getByRole("usernameField")
      const passwordField = screen.getByRole("passwordField")
      await user.type(usernameField, "TESTINPUT")
      expect(usernameField).toHaveValue("TESTINPUT")
      await user.type(passwordField, "TESTPASSWORD")
      expect(passwordField).toHaveValue("TESTPASSWORD")
    })
    it("Can send a correct request", async () => {
      const loginUser = vi.fn().mockResolvedValue({ success: true })
      useUserStore.setState((s) => ({ actions: { ...s.actions, loginUser } }))
      const user = userEvent.setup()
      render(<LoginScreen />)
      const usernameField = screen.getByRole("usernameField")
      const passwordField = screen.getByRole("passwordField")
      const submitButton = screen.getByRole("button")

      await user.type(usernameField, "ABOVESIX")
      await user.type(passwordField, "ABOVESIX")
      expect(submitButton).toBeEnabled()

      await user.click(submitButton)

      expect(loginUser).toHaveBeenCalledWith("ABOVESIX", "ABOVESIX")
      expect(navigateMock).toHaveBeenCalledTimes(1)
    })
    it("Incorrect username fails", async () => {
      const loginUser = vi.fn().mockResolvedValue({ success: true })
      useUserStore.setState((s) => ({ actions: { ...s.actions, loginUser } }))
      const user = userEvent.setup()
      render(<LoginScreen />)
      const usernameField = screen.getByRole("usernameField")
      const passwordField = screen.getByRole("passwordField")
      const submitButton = screen.getByRole("button")

      await user.type(usernameField, "LESS")
      await user.type(passwordField, "ABOVESIX")
      expect(submitButton).toBeEnabled()

      await user.click(submitButton)

      expect(loginUser).toHaveBeenCalledTimes(0)
      expect(navigateMock).toHaveBeenCalledTimes(0)

      expect(screen.getByRole("feedback")).toBeInTheDocument()
    })
    it("Incorrect password fails", async () => {
      const loginUser = vi.fn().mockResolvedValue({ success: true })
      useUserStore.setState((s) => ({ actions: { ...s.actions, loginUser } }))
      const user = userEvent.setup()
      render(<LoginScreen />)
      const usernameField = screen.getByRole("usernameField")
      const passwordField = screen.getByRole("passwordField")
      const submitButton = screen.getByRole("button")

      await user.type(usernameField, "ABOVESIX")
      await user.type(passwordField, "LESS")
      expect(submitButton).toBeEnabled()

      await user.click(submitButton)

      expect(loginUser).toHaveBeenCalledTimes(0)
      expect(navigateMock).toHaveBeenCalledTimes(0)

      expect(screen.getByRole("feedback")).toBeInTheDocument()
    })
    it("Fails if already logged in", async () => {
      const loginUser = vi.fn().mockResolvedValue({ success: true })
      useUserStore.setState((s) => ({
        actions: { ...s.actions, loginUser },
        user: { id: "test", username: "tester" },
        token: "fake-token",
      }))
      const user = userEvent.setup()
      render(<LoginScreen />)
      const usernameField = screen.getByRole("usernameField")
      const passwordField = screen.getByRole("passwordField")
      const submitButton = screen.getByRole("button")

      await user.type(usernameField, "ABOVESIX")
      await user.type(passwordField, "ABOVESIX")
      expect(submitButton).toBeEnabled()

      await user.click(submitButton)

      expect(loginUser).toHaveBeenCalledTimes(0)
      expect(navigateMock).toHaveBeenCalledTimes(0)

      expect(screen.getByRole("feedback")).toBeInTheDocument()
    })
    it("Doesn't navigate and shows feedback on failure", async () => {
      const loginUser = vi
        .fn()
        .mockResolvedValue({ success: false, error: "test error" })
      useUserStore.setState((s) => ({ actions: { ...s.actions, loginUser } }))
      const user = userEvent.setup()
      render(<LoginScreen />)
      const usernameField = screen.getByRole("usernameField")
      const passwordField = screen.getByRole("passwordField")
      const submitButton = screen.getByRole("button")

      await user.type(usernameField, "ABOVESIX")
      await user.type(passwordField, "ABOVESIX")
      expect(submitButton).toBeEnabled()

      await user.click(submitButton)

      expect(loginUser).toHaveBeenCalledTimes(1)
      expect(navigateMock).toHaveBeenCalledTimes(0)

      expect(screen.getByRole("feedback")).toBeInTheDocument()
    })
  })
})
