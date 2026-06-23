import { UseField } from "../hooks"

const HomeScreen = () => {
  const { reset: reset, ...proposition } = UseField("text")
  return (
    <div className="fullscreen-container">
      <div className="info-tile">
        <h1>Logic tasks found here!</h1>
        <p className="subtitle">
          Type naturally to create symbols automatically:
        </p>

        <div className="symbol-grid">
          <div className="grid-item">
            <kbd>and</kbd> <span>→</span> <span className="symbol">∧</span>
          </div>
          <div className="grid-item">
            <kbd>or</kbd> <span>→</span> <span className="symbol">∨</span>
          </div>
          <div className="grid-item">
            <kbd>not</kbd> <span>→</span> <span className="symbol">¬</span>
          </div>
          <div className="grid-item">
            <kbd>-&gt;</kbd> or <kbd>imply</kbd> <span>→</span>{" "}
            <span className="symbol">→</span>
          </div>
          <div className="grid-item">
            <kbd>&lt;-&gt;</kbd> <span>→</span>{" "}
            <span className="symbol">↔</span>
          </div>
          <p className="subtitle">But how do i use them?</p>
        </div>
      </div>
      <textarea
        {...proposition}
        className="massive-input"
        placeholder="A and B Therefore C"
      />
    </div>
  )
}

export default HomeScreen
