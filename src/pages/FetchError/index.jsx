import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';

export default function FetchError() {
  useTitle('Error | Neohabit');
  const navigate = useNavigate();

  return (
    <div className="contentlist centering">
      <div className="contentlist-header">
        <h3>Error</h3>
      </div>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        If this is the first time you try to access this website, then our servers might be on
        maintenance currently, in which case we&apos;re sorry for the inconvenience.
      </p>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        Otherwise, you might have exceeded the allowed limit of requests, try again in a minute...
      </p>
    </div>
  );
}
