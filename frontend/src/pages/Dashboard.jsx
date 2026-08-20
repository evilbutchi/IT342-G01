import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="dash-shell">
      <div className="dash-card">
        <div className="dash-top">
          <div>
            <span className="eyebrow">Session active</span>
            <h1 className="dash-title">Dashboard</h1>
          </div>
          
        </div>

        <div className="info-grid">
          <div className="info-cell">
            <div className="k">User ID</div>
            <div className="v">{user?.id ?? '—'}</div>
          </div>
          <div className="info-cell">
            <div className="k">Username</div>
            <div className="v">{user?.username ?? '—'}</div>
          </div>
          <div className="info-cell" style={{ gridColumn: '1 / -1' }}>
            <div className="k">Email</div>
            <div className="v">{user?.email ?? '—'}</div>
          </div>
        </div>

        <div className="welcome-banner">
          You're logged in, {user?.username}.
        </div>
      </div>
    </div>
  );
}
