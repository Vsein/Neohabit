import React from 'react';
import pfp from '../assets/pfp.jpg';

export default function PFP(props) {
  const { type } = props;
  return (
    <a tabIndex="0" className="centering">
      <img src={pfp} alt="profile pic" className={`pfp ${type}`} />
    </a>
  );
}
