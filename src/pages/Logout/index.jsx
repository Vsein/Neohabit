import React from 'react';
import { Navigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

export default function Logout() {
  const [loggedOut] = useLogout();

  return loggedOut ? (
    <div className="loader" />
  ) : (
    <Navigate to="/login" replace />
  );
}
