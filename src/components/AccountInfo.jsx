import React from 'react';
import pfp from '../assets/pfp.jpg';
import { useGetSelfQuery } from '../state/services/settings';

export default function AccountInfo() {
  const self = useGetSelfQuery();

  return (
    <div className="account-info">
      <img src={pfp} alt="profile pic" className="pfp small" />
      <p>{`@${self.data.username}`}</p>
      {self.isLoading || self.isFetching ? (
        <></>
      ) : (
        <p className="account-username">{self.data.email}</p>
      )}
    </div>
  );
}
