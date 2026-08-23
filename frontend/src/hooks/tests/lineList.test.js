import { describe, expect, it } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useLineList } from "../lineList"

describe("useLineList", () => {
  it("Initial state renders", () => {
    const { result } = renderHook(() => useLineList(["a", "b", "c"]))
    expect(result.current.lines).toEqual(["a", "b", "c"])
  })
  it("edits the line at the given index", () => {
    const { result } = renderHook(() => useLineList(["a", "b", "c"]))

    act(() => {
      result.current.change("x", 1)
    })

    expect(result.current.lines).toEqual(["a", "x", "c"])
  })
  it("Adds lines", () => {
    const { result } = renderHook(() => useLineList(["a"]))

    act(() => {
      result.current.addRemove(1)
    })

    expect(result.current.lines).toEqual(["a", ""])
  })
  it("Removes lines", () => {
    const { result } = renderHook(() => useLineList(["a", "b"]))

    act(() => {
      result.current.addRemove(0)
    })

    expect(result.current.lines).toEqual(["a"])
  })
  it("Doesn't add more than is allowed", () => {
    const { result } = renderHook(() =>
      useLineList(["a", "b", "c"], { min: 2, max: 3 }),
    )
    act(() => {
      result.current.addRemove(1)
    })
    expect(result.current.lines).toEqual(["a", "b", "c"])
  })
  it("Doesn't remove more than is allowed", () => {
    const { result } = renderHook(() =>
      useLineList(["a", "b"], { min: 2, max: 3 }),
    )
    act(() => {
      result.current.addRemove(0)
    })
    expect(result.current.lines).toEqual(["a", "b"])
  })
  it("SetLines allows changing the whole list", () => {
    const { result } = renderHook(() =>
      useLineList(["a", "b"], { min: 2, max: 3 }),
    )
    act(() => {
      result.current.setLines([">", "X", "Y", "W"])
    })
    expect(result.current.lines).toEqual([">", "X", "Y", "W"])
  })
})
