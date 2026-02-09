import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

/**
 * Sidebar Component
 * Navigation sidebar for the application
 */
function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Business Ops</h1>
        <p className="sidebar-subtitle">Dashboard</p>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`nav-link ${isActive('/dashboard')}`}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </Link>

        <Link
          to="/products"
          className={`nav-link ${isActive('/products')}`}
        >
          <span className="nav-icon">📦</span>
          <span className="nav-text">Products</span>
        </Link>

        <Link
          to="/"
          className="nav-link logout"
        >
          <span className="nav-icon">🚪</span>
          <span className="nav-text">Logout</span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
