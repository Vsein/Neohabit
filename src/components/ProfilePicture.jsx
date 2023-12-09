import React from 'react';
import MiniLogoDark from '../logos/neohabit-mini-logo-dark2.png';
import MiniLogo from '../logos/neohabit-mini-logo.png';
import { useGetSettingsQuery } from '../state/services/settings';

export default function PFP({ type }) {
  const settings = useGetSettingsQuery();

  return settings.isLoading ? (
    <></>
  ) : (
    <a tabIndex="0" className="centering">
      <img
        src={settings.data.prefer_dark ? MiniLogoDark : MiniLogo}
        alt="profile pic"
        className={`pfp ${type}`}
      />
    </a>
  );
}
