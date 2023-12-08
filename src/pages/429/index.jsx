import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';

export default function Exceeded() {
  useTitle('429 | Neohabit');
  const navigate = useNavigate();

  return (
    <div className="contentlist centering">
      <div className="contentlist-header">
        <h3>Error: 429</h3>
      </div>
      <p className="back-ref">
        You exceeded the allowed limit of requests, try again in a minute...
      </p>
    </div>
  );
}
