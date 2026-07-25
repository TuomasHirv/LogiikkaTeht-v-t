import { beforeEach, describe, expect, it, vi } from "vitest"
import useUserStore from "./Store"
import { userService } from "./services/userService"
import { answerService } from "./services/answerService"

vi.mock("./services/userService", () => ({
  userService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

vi.mock("./services/answerService", () => ({
  answerService: {
    getAll: vi.fn(),
  },
}))

const initialState = useUserStore.getState()

beforeEach(() => {
  useUserStore.setState(initialState, true)
  localStorage.clear()
  vi.clearAllMocks()
})

describe("Store tests:", () => {
  describe("Actions", () => {
    const { actions } = useUserStore.getState()
    it("Login", async () => {
      userService.login.mockResolvedValue({
        user: { id: 1, username: "tester" },
        token: "token",
      })

      await actions.loginUser("ann", "pw")
      expect(useUserStore.getState().user).toEqual({
        id: 1,
        username: "tester",
      })
      expect(useUserStore.getState().token).toEqual("token")
    })
    it("Register", async () => {
      userService.register.mockResolvedValue({
        user: { id: 1, username: "tester" },
        token: "token",
      })

      await actions.registerUser("ann", "pw")
      expect(useUserStore.getState().user).toEqual({
        id: 1,
        username: "tester",
      })
      expect(useUserStore.getState().token).toEqual("token")
    })
    it("Logout", async () => {
      useUserStore.setState({
        user: { id: 1, username: "tester" },
        token: "token",
        answers: {
          task1: {
            submitted_answer: "answerText",
            is_correct: "isCorrect",
            feedback: "feedback",
            module_name: "moduleName",
          },
        },
      })

      actions.logoutUser()
      expect(useUserStore.getState().user).toEqual(null)
      expect(useUserStore.getState().token).toEqual(null)
      expect(useUserStore.getState().answers).toEqual({})
    })
    it("Add answer", () => {
      actions.addAnswer("task1", "text", true, "Pass", "Test")
      expect(useUserStore.getState().answers["task1"].is_correct).toEqual(true)
      expect(useUserStore.getState().answers["task1"].feedback).toEqual("Pass")
      expect(useUserStore.getState().answers["task1"].module_name).toEqual(
        "Test",
      )
    })
    it("Initialize", async () => {
      answerService.getAll.mockResolvedValue({
        answerList: [
          {
            task_id: "task1",
            submitted_answer: "test",
            is_correct: true,
            feedback: "Pass",
            module_name: "Test",
          },
          {
            task_id: "task2",
            submitted_answer: "second test",
            is_correct: true,
            feedback: "Pass",
            module_name: "Test",
          },

          {
            task_id: "task3",
            submitted_answer: "third test",
            is_correct: true,
            feedback: "Pass",
            module_name: "Test",
          },
        ],
      })
      useUserStore.setState({
        user: { id: 1, username: "tester" },
        token: "token",
      })

      await actions.initialize()
      expect(useUserStore.getState().answers["task1"].submitted_answer).toEqual(
        "test",
      )
      expect(useUserStore.getState().answers["task2"].submitted_answer).toEqual(
        "second test",
      )

      expect(useUserStore.getState().answers["task3"].submitted_answer).toEqual(
        "third test",
      )
    })
  })
  it("has the expected initial state", () => {
    const { user, token, answers } = useUserStore.getState()
    expect(user).toBeNull()
    expect(token).toBeNull()
    expect(answers).toEqual({})
  })
})
