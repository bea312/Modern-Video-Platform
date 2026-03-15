import { FiBell, FiMenu, FiUser } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../Search/SearchBar';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, login, logout, subscriptionCount } = useAuth();
  const handleAuth = () => {
    if (user) {
      logout();
      return;
    }
    login();
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <FiMenu className="navbar-icon" />
        <span className="navbar-logo">Tube</span>
      </div>
      <SearchBar />
      <div className="navbar-right">
        <button type="button" className="ghost" title={`${subscriptionCount} subscriptions`}>
          <FiBell />
          {subscriptionCount > 0 && <span className="badge">{subscriptionCount}</span>}
        </button>
        <Link to="/login" className="ghost auth-link">
          <FiUser />
          {user && <span className="auth-label">{user.name}</span>}
        </Link>
        {user ? (
          <button type="button" className="ghost auth" onClick={logout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="ghost auth">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
