import { Link } from "react-router-dom"
import useUserStore, { useUserActions } from "../store"
import UserIndicator from "./user/UserIndicator"
const NavBar = () => {
  const user = useUserStore((state) => state.user)
  const { logoutUser } = useUserActions()
  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-blue-300 flex items-center box-border px-8">
      <div
        style={{ display: "flex", gap: "1.5rem" }}
        className="w-full items-center"
      >
        <Link to="/" className="nav-btn-primary">
          {" "}
          Home{" "}
        </Link>
        <Link to="/part/1/section/1" className="nav-btn-primary">
          {" "}
          Intro{" "}
        </Link>
        <Link to="/part/2/section/1" className="nav-btn-primary">
          {" "}
          Semantic tree{" "}
        </Link>
        <Link to="/part/3/section/1" className="nav-btn-primary">
          {" "}
          Resolution method{" "}
        </Link>
        <Link to="/part/4/section/1" className="nav-btn-primary">
          {" "}
          Natural deduction{" "}
        </Link>

        <div className="flex ml-auto">
          {!user ? (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <UserIndicator className="bg-blue-500 rounded text-black border-2 border-red-400 flex items-center justify-center min-w-20 min-h-10" />
              <Link to="/login" className="nav-btn-primary">
                {" "}
                Login{" "}
              </Link>
              <Link to="/register" className="nav-btn-primary">
                {" "}
                Register{" "}
              </Link>
            </div>
          ) : (
            <div className="flex gap-0.5">
              <Link to="/userpage">
                <UserIndicator className="nav-btn-primary" />
              </Link>
              <button className="nav-btn-primary" onClick={logoutUser}>
                {" "}
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
