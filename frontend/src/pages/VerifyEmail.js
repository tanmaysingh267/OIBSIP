import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useContext(AuthContext);
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Verification token is required');
      return;
    }

    try {
      const response = await verifyEmail(token);
      setSuccess(response.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Verification failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Verify Email</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          {!searchParams.get('token') && (
            <input
              type="text"
              placeholder="Enter verification token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          )}
          <button type="submit">Verify Email</button>
        </form>
        <p>
          <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
