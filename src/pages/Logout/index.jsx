import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function Logout() {
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    localStorage.clear();
    setLoggedOut(true);
  }, []);

  return loggedOut ? (
    <div />
  ) : (
    <Navigate to="/login" replace />
  );
}
