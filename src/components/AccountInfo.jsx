import React from 'react';
import pfp from '../assets/pfp.jpg';

export default function AccountInfo() {
  return (
    <div className="account-info">
      <img
        src={pfp}
        alt="profile pic"
        className="pfp small"
      />
      <p>Serene Coder</p>
      <p className="account-username"> @Vsein </p>
    </div>
  );
}
