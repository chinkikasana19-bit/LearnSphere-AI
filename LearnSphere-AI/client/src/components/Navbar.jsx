import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link className="brand" to="/">
        <BrainCircuit size={25} />
        LearnSphere AI
      </Link>

      <div className="nav-links">
        <Link to="/">Courses</Link>
        {user && <Link to="/dashboard">Dashboard</Link>}
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link className="button small" to="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="user-chip">
              {user.name} · {user.role}
            </span>
            <button className="icon-button" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
