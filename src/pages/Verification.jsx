import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useGetVerifiedQuery } from '../state/services/settings';

export default function Logout() {
  const { token } = useParams();
  const verification = useGetVerifiedQuery({ token });

  if (verification.isLoading || verification.isFetching) {
    return <div className="loader" />;
  }

  if (verification.data === 'Token expired') {
    return (
      <div className="contentlist centering">
        <div className="contentlist-header">
          <h3>Token expired</h3>
        </div>
      </div>
    );
  }

  return <Navigate to="/projects" replace />;
}
