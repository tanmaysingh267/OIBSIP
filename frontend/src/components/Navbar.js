import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, admin, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAdminLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 onClick={() => navigate('/')}>🍕 Pizza Delivery</h1>
        </div>
        <div className="navbar-menu">
          {user ? (
            <>
              <span className="user-info">Welcome, {user.name}</span>
              <button onClick={() => navigate('/dashboard')} className="nav-link">
                Dashboard
              </button>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : admin ? (
            <>
              <span className="user-info">Admin: {admin.name}</span>
              <button onClick={() => navigate('/admin/dashboard')} className="nav-link">
                Admin Panel
              </button>
              <button onClick={handleAdminLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="nav-link">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="nav-link">
                Register
              </button>
              <button onClick={() => navigate('/admin/login')} className="nav-link">
                Admin
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
