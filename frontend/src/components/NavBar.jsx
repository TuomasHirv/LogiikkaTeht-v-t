import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import useUserStore, { useUserActions } from "../store"

const NavBar = () => {
  const user = useUserStore((state) => state.user)
  const { logoutUser } = useUserActions()
  const navigate = useNavigate()
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "80px",
        backgroundColor: "#0d5de0",
        alignItems: "center",
        display: "flex",
        boxSizing: "border-box",
        padding: "0 2rem",
      }}
    >
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link to="/" className="buttonStyle">
          {" "}
          Home{" "}
        </Link>
        <Link to="/part/1/words-to-propositions" className="buttonStyle">
          {" "}
          Part 1{" "}
        </Link>
        {!user ? (
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link to="/login" className="buttonStyle">
              {" "}
              Login{" "}
            </Link>
            <Link to="/register" className="buttonStyle">
              {" "}
              Register{" "}
            </Link>
          </div>
        ) : (
          <button className="buttonStyle" onClick={logoutUser}>
            {" "}
            Log out
          </button>
        )}
      </div>
    </nav>
  )
}

export default NavBar
