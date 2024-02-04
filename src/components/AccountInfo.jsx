import React from 'react';
import { useGetSelfQuery, useGetSettingsQuery } from '../state/wrappers/settings';

export default function AccountInfo() {
  const self = useGetSelfQuery();
  const settings = useGetSettingsQuery();

  return self.isLoading || settings.isLoading ? (
    <></>
  ) : (
    <div className="account-info">
      <img alt="profile pic" className="pfp small" />
      <p>{`@${self.data.username}`}</p>
      <p className="account-username">{self.data.email}</p>
    </div>
  );
}
