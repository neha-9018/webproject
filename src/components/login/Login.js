import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../Api/axiosConfig';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Username:', username);
    console.log('Password length:', password.length);

    try {
      if (!username || !password) {
        setError('Please enter both username and password');
        setLoading(false);
        return;
      }

      console.log('Calling authAPI.login...');
      const response = await authAPI.login(username, password);
      
      console.log('=== LOGIN SUCCESS ===');
      console.log('Full response:', response);

      if (response.token) {
        console.log('Token received:', response.token.substring(0, 20) + '...');
        localStorage.setItem('authToken', response.token);
      }
      
      if (response.user) {
        console.log('User data:', response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      alert('Login successful! Redirecting...');
      navigate('/');
      
    } catch (err) {
      console.error('=== LOGIN FAILED ===');
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response) {
        const errorData = err.response.data;
        console.log('Backend returned:', errorData);
        
        switch (err.response.status) {
          case 401:
            setError('Invalid username or password');
            break;
          case 400:
            const msg = typeof errorData === 'string' ? errorData : (errorData?.error || 'Invalid request');
            setError(msg);
            break;
          case 403:
            setError('Access forbidden');
            break;
          case 404:
            setError('Login service not found');
            break;
          case 500:
            setError('Server error');
            break;
          default:
            setError('Login failed: ' + (errorData?.error || errorData?.message || 'Unknown error'));
        }
      } else if (err.request) {
        setError('Cannot connect to server. Is the backend running?');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to MoviesWallah</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => {
                console.log('Username changed to:', e.target.value);
                setUsername(e.target.value);
              }}
              placeholder="Enter your username"
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                console.log('Password changed, length:', e.target.value.length);
                setPassword(e.target.value);
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;