import { Link, useNavigate } from 'react-router-dom';
import '../styles/nav.css';  // Import the external nav.css file

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Parse token to get role (assuming JWT token stores role in payload)
  let role = 'student';
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      role = decoded.role || 'student';
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">Job Portal</Link>
        <div className="navbar-links">
          {token ? (
            <>
              {role === 'recruiter' && (
                <Link to="/post-job" className="navbar-link">Post Job</Link>
              )}
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <button onClick={logout} className="navbar-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;