import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { user, login, logout, subscriptionCount, subscriptions, toggleSubscription } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [channelId, setChannelId] = useState('');
  const [channelTitle, setChannelTitle] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setStatus('Please enter a name to continue.');
      return;
    }
    login(name.trim());
    setStatus(`Welcome ${name.trim()}! Redirecting to feed…`);
    setTimeout(() => navigate('/'), 800);
  };

  const handleLogout = () => {
    logout();
    setStatus('Logged out successfully.');
  };

  const handleSubscribeForm = (event) => {
    event.preventDefault();
    if (!channelId || !channelTitle) {
      setStatus('Add a channel ID + title to simulate a subscription.');
      return;
    }
    toggleSubscription(channelId, channelTitle);
    setStatus(`Toggled subscription for ${channelTitle}.`);
    setChannelId('');
    setChannelTitle('');
  };
  return (
    <div className="login-page     "     >
     
      <section className="login-panel">
        <div className="panel-card">
          <h2>{user ? 'Update session' : 'Welcome to ReelTube'}</h2>
          <p>Just pick a nickname to start curating your mock subscriptions.</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Nickname</label>
            <input
              id="username"
              name="username"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter a display name"
            />
            <div className="form-actions">
              <button type="submit">{user ? 'Refresh session' : 'Login'}</button>
              {user && (
                <button type="button" className="ghost" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="panel-card">
          <h2>Mock subscription</h2>
          <p>Simulate subscribing to any channel without hitting the API quota.</p>
          <form onSubmit={handleSubscribeForm} className="subscription-form">
            <label htmlFor="channel-id">Channel ID</label>
            <input
              id="channel-id"
              value={channelId}
              onChange={(event) => setChannelId(event.target.value)}
              placeholder="UC123abc..."
            />
            <label htmlFor="channel-title">Channel Name</label>
            <input
              id="channel-title"
              value={channelTitle}
              onChange={(event) => setChannelTitle(event.target.value)}
              placeholder="Creator name"
            />
            <button type="submit">Toggle Subscribe</button>
          </form>
        </div>
        <div className="subscription-list panel-card">
          <h3>Your subscriptions ({subscriptionCount})</h3>
          {subscriptionCount === 0 ? (
            <p>No subscriptions yet. Use the form above or visit a channel page.</p>
          ) : (
            <ul>
              {Object.entries(subscriptions).map(([id, details]) => (
                <li key={id}>
                  <strong>{details.title}</strong>
                  <span>{new Date(details.toggledAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <Link to="/" className="button-link">
        Back to feed
      </Link>
    </div>
  );
};

export default Login;
