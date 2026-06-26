import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import useUserStore, { useUserActions } from "../store"

const NavBar = () => {
  const user = useUserStore((state) => state.user)
  const { logoutUser } = useUserActions()
  const navigate = useNavigate()
  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-blue-300 flex items-center box-border px-8">
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link to="/" className="nav-btn-primary">
          {" "}
          Home{" "}
        </Link>
        <Link to="/part/1/section/1" className="nav-btn-primary">
          {" "}
          Part 1{" "}
        </Link>
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
          <button className="nav-btn-primary" onClick={logoutUser}>
            {" "}
            Log out
          </button>
        )}
      </div>
    </nav>
  )
}

export default NavBar
