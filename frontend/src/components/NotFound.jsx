import { lazy } from "react"
const notFoundImage = lazy(() => import("../assets/coolPick.jfif"))
const NotFound = () => {
  return (
    <div>
      <h1>404 not found</h1>
      <img
        src={notFoundImage}
        alt="coolPick"
        style={{
          maxWidth: "100%",
          height: "auto",
          marginTop: "20px",
          borderRadius: "8px",
        }}
      />
    </div>
  )
}

export default NotFound
