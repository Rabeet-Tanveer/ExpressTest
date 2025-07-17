import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api/users';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Password change failed');
        return;
      }
      setMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError('Network error');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Account deletion failed');
        return;
      }
      // Logout after deletion
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      setError('Network error');
    }
  };

  if (!user) return null;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, <b>{user.email}</b>!</p>
      <button onClick={handleLogout}>Logout</button>
      <hr />
      <h3>Change Password</h3>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Old Password:</label>
          <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
        </div>
        <div>
          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </div>
        <button type="submit">Change Password</button>
      </form>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <hr />
      <h3>Delete Account</h3>
      <button style={{ color: 'red' }} onClick={handleDeleteAccount}>Delete My Account</button>
    </div>
  );
}

export default Dashboard;
