import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import { useRequestVerificationEmailMutation } from '../state/services/settings';

export default function VerificationError() {
  useTitle('Verification | Neohabit');
  const [requestEmail] = useRequestVerificationEmailMutation();

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
        Otherwise, request to{' '}
        <Link onClick={() => requestEmail()} style={{ width: 'auto', display: 'inline-block' }}>
          resend you the link.
        </Link>
      </p>
    </div>
  );
}
