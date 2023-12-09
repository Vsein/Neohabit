import React from 'react';
import MiniLogoDark from '../logos/neohabit-mini-logo-dark2.png';
import MiniLogo from '../logos/neohabit-mini-logo.png';
import { useGetSelfQuery, useGetSettingsQuery } from '../state/services/settings';

export default function AccountInfo() {
  const self = useGetSelfQuery();
  const settings = useGetSettingsQuery();

  return self.isLoading || settings.isLoading ? (
    <></>
  ) : (
    <div className="account-info">
      <img
        src={settings.data.prefer_dark ? MiniLogoDark : MiniLogo}
        alt="profile pic"
        className="pfp small"
      />
      <p>{`@${self.data.username}`}</p>
      <p className="account-username">{self.data.email}</p>
    </div>
  );
}
