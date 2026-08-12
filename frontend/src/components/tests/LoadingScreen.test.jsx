import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import LoadingScreen from "../LoadingScreen"

describe("LoadingScreen", () => {
  it("Shows spinner when not failed", () => {
    render(<LoadingScreen />)
    expect(screen.getByRole("status")).toBeInTheDocument()
  })
  it("Shows failuer when failed", () => {
    render(<LoadingScreen failed={true} />)
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })
})
