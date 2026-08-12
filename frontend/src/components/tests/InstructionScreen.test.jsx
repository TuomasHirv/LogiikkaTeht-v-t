import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import "@testing-library/jest-dom/vitest"
import expected from "../../content/instructions/part1section1"
import InstructionScreen from "../InstructionScreen"

function renderAt(ui, path, route) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={route} element={ui} />
      </Routes>
    </MemoryRouter>,
  )
}

describe("InstructionScreen", () => {
  describe("Loads content correctly", () => {
    it("renders definitions", async () => {
      renderAt(<InstructionScreen />, "/i/1/1", "/i/:id/:section")
      const items = await screen.findAllByRole("listitem")
      expect(items).toHaveLength(expected.definitions.length)
    })
    it("renders introcution, title and taskLink", async () => {
      renderAt(<InstructionScreen />, "/i/1/1", "/i/:id/:section")
      expect(await screen.findByRole("title")).toBeInTheDocument()
      expect(await screen.findByRole("introduction")).toBeInTheDocument()
      expect(await screen.findByRole("taskLink")).toBeInTheDocument()
    })
    it("renders all examples", async () => {
      renderAt(<InstructionScreen />, "/i/1/1", "/i/:id/:section")
      expect(await screen.findAllByRole("example")).toHaveLength(
        expected.examples.length,
      )
    })
    it("renders all paragraphs", async () => {
      renderAt(<InstructionScreen />, "/i/1/1", "/i/:id/:section")
      await screen.findAllByRole("paragraph")
    })
    it("renders all examples", async () => {
      renderAt(<InstructionScreen />, "/i/1/1", "/i/:id/:section")
      expect(await screen.findAllByRole("instructionLine")).toHaveLength(
        expected.paragraphs.length,
      )
    })
  })
  describe("Loading screen", () => {
    it("Loading error renders", async () => {
      renderAt(<InstructionScreen />, "/i/99/99", "/i/:id/:section")
      expect(await screen.findByRole("alert")).toBeInTheDocument()
    })
  })
})
