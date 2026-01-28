import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authContext.jsx";

export default function SiteNavbar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Vehicle Yard</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="nav" className="collapse navbar-collapse">
          <div className="navbar-nav ms-auto">
            <NavLink className="nav-link" to="/">Vehicles</NavLink>
            <NavLink className="nav-link" to="/about">About</NavLink>
            <NavLink className="nav-link" to="/contact">Contact</NavLink>
            
            {isAdmin ? (
              <>
                <NavLink className="nav-link" to="/admin/vehicles">Admin</NavLink>
                <NavLink className="nav-link" to="/admin/finance">Finance</NavLink>
                <NavLink className="nav-link" to="/admin/sold">Sold Vehicles</NavLink>
                <button 
                  className="nav-link btn btn-link text-decoration-none"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink className="nav-link" to="/login">Admin Login</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
