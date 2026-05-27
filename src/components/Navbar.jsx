import React, { useContext, useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { Lightbulb, Sun, Moon, LogOut, User, PlusCircle, Bookmark, Layers, MessageSquare, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle global theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    toast.success(`${theme === 'light' ? 'Dark' : 'Light'} mode enabled!`, {
      style: {
        background: theme === 'light' ? '#0f172a' : '#ffffff',
        color: theme === 'light' ? '#f8fafc' : '#0f172a',
        border: '1px solid var(--border-color)'
      }
    });
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success('Logged out successfully!');
        setDropdownOpen(false);
        navigate('/');
      })
      .catch((err) => {
        toast.error('Logout failed: ' + err.message);
      });
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <Lightbulb className="gradient-text" size={28} fill="currentColor" />
          <span>Idea<span className="gradient-text">Vault</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
          <NavLink to="/ideas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Ideas
          </NavLink>
          
          {user && (
            <>
              <NavLink to="/add-idea" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Add Idea
              </NavLink>
              <NavLink to="/my-ideas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                My Ideas
              </NavLink>
              <NavLink to="/my-interactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                My Interactions
              </NavLink>
            </>
          )}
        </div>

        {/* Actions (Theme toggle + Profile/Login) */}
        <div className="nav-actions">
          {/* Light/Dark Toggle */}
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <div className="profile-menu">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="profile-trigger"
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
              >
                <img 
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                  alt={user.displayName} 
                  className="profile-avatar"
                />
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-user-name">{user.displayName || 'Idea Innovator'}</div>
                    <div className="dropdown-user-email">{user.email}</div>
                  </div>
                  <Link to="/profile" className="dropdown-item">
                    <User size={16} />
                    <span>Manage Profile</span>
                  </Link>
                  <Link to="/my-ideas" className="dropdown-item">
                    <Layers size={16} />
                    <span>My Ideas</span>
                  </Link>
                  <Link to="/my-interactions" className="dropdown-item">
                    <MessageSquare size={16} />
                    <span>Interactions</span>
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item" style={{ borderTop: '1px solid var(--border-color)', width: '100%', background: 'none' }}>
                    <LogOut size={16} className="error" />
                    <span className="error">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
