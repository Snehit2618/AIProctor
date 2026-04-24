import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const roleRoutes = {
  student: '/student-login',
  jobseeker: '/jobseeker-login',
  employer: '/employer-login',
  admin: '/admin-login'
};

const protectedEndpoints = {
  student: '/api/protected/student',
  jobseeker: '/api/protected/student',
  employer: '/api/protected/employer',
  admin: '/api/protected/admin'
};

export default function ProtectedRoute({ role, children }) {
  const [allowed, setAllowed] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const endpoint = protectedEndpoints[role] || protectedEndpoints.student;
        const response = await fetch(`http://localhost:5001${endpoint}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        setAllowed(data.allowed);
        if (data.allowed && data.user) {
          const userWithRole = { ...data.user, role: role };
          sessionStorage.setItem('user', JSON.stringify(userWithRole));
        } else {
          sessionStorage.removeItem('user');
        }
        setError(null);
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err.message);
        setAllowed(false);
        sessionStorage.removeItem('user');
      }
    };

    checkAuth();
  }, [role]);

  if (allowed === null) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#4361ee',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#ef4444'
      }}>
        Error: {error}
      </div>
    );
  }

  if (!allowed) {
    const redirectPath = roleRoutes[role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
