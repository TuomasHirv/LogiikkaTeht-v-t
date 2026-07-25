import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import useUserStore, { useUserActions } from "../store"

const NavBar = () => {
  const user = useUserStore((state) => state.user)
  const { logoutUser } = useUserActions()
  const navigate = useNavigate()
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
              <Link to="/userpage" className="nav-btn-primary">
                {" "}
                Tasks{" "}
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
