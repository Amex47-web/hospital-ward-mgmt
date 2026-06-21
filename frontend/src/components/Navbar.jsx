import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Show navbar everywhere now, including landing page

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to={token ? '/dashboard' : '/'} className="nav-brand">
        <span className="nav-logo">🏥</span>
        <span className="nav-brand-text">WardManager</span>
      </Link>
      <div className="nav-right">
        {token && user ? (
          <>
            <span className="nav-user">{user.full_name || user.email}</span>
            <button className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <div className="nav-auth-links">
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/signup" className="nav-link nav-link-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
