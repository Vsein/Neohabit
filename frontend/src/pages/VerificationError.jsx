import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import { useGetSelfQuery, useRequestVerificationEmailMutation } from '../state/services/settings';

export default function VerificationError() {
  useTitle('Verification | Neohabit');
  const [requestEmail] = useRequestVerificationEmailMutation();
  const self = useGetSelfQuery();
  const [timer, setTimer] = useState(60);

  const calcTimeout = () => {
    if (self?.data?.verification_attempts >= 3) {
      return null;
    }
    if (self?.data?.registration_time) {
      return (
        60 - Math.floor(Math.abs((Date.now() - new Date(self?.data?.registration_time)) / 1000))
      );
    }
    return null;
  };

  useEffect(() => {
    if (self?.data) {
      let timerInterval = setInterval(() => {
        const recalc = calcTimeout();
        setTimer(recalc);
      }, 1000);
      // Clear interval if the component is unmounted
      return () => clearInterval(timerInterval);
    }
    setTimer(0);
  });

  if (self.isLoading || self.isFetching) {
    return <div className="loader" />;
  }

  return (
    <div className="contentlist centering">
      <div className="contentlist-header">
        <h3>Please verify your email</h3>
      </div>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        We sincerely thank you for registering in Neohabit! Before you can proceed, follow the link
        that has been sent to your email by noreply@neohabit.org
      </p>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        If you can&apos;t find the email, check your spam folder.
      </p>
      {self?.data?.verification_attempts >= 3 ? (
        <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
          It seems that you weren&apos;t able to verify your account after 3 attempts. To prevent
          spamming, no more emails will be sent. If it was not your intention, or you didn&apos;t
          get those emails, reach out to the contacts listed on landing.
        </p>
      ) : (
        <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
          Otherwise, request to{' '}
          <Link
            onClick={() => timer <= 0 && requestEmail()}
            style={{
              opacity: timer > 0 ? 0.5 : 1,
              width: 'auto',
              display: 'inline-block',
              pointerEvents: timer > 0 ? 'none' : '',
            }}
          >
            resend you the link.
          </Link>{' '}
          {timer > 0 ? `(available in ${timer})` : ''}
        </p>
      )}
    </div>
  );
}
