import React from 'react';

export default function PFP({ type }) {
  return (
    <a tabIndex="0" className="centering">
      <img alt="profile pic" className={`pfp ${type}`} />
    </a>
  );
}
