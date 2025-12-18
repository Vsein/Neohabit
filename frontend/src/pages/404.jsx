import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useTitle from '../hooks/useTitle';

export default function NotFound() {
  useTitle('404 | Neohabit');
  const navigate = useNavigate();

  return (
    <div className="contentlist">
      <div className="contentlist-header">
        <h3>Error: 404</h3>
      </div>
      <p className="back-ref">
        There doesn&apos;t seem to be anything...
        <Link onClick={() => navigate(-1)}>Go back</Link>
      </p>
    </div>
  );
}
