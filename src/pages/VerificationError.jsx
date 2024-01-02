import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useTitle from '../hooks/useTitle';

export default function FetchError() {
  useTitle('Error | Neohabit');
  const navigate = useNavigate();

  return (
    <div className="contentlist centering">
      <div className="contentlist-header">
        <h3>Please verify your email</h3>
      </div>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        We sincerely thank you for registering in Neohabit! Before you can proceed, follow the link
        that has been sent to your email by noreply@neohabit.app
      </p>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        If you can&apos;t find the email, check your spam folder.
      </p>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        Otherwise, request to resend you the link.
      </p>
    </div>
  );
}
