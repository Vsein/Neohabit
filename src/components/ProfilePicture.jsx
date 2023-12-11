import React from 'react';
import { useGetSettingsQuery } from '../state/services/settings';

export default function PFP({ type }) {
  const settings = useGetSettingsQuery();

  return settings.isLoading ? (
    <></>
  ) : (
    <a tabIndex="0" className="centering">
      <img alt="profile pic" className={`pfp ${type}`} />
    </a>
  );
}
