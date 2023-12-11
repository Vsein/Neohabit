import React from 'react';
import Overview from '../components/Overview';
import useTitle from '../hooks/useTitle';

export default function Dashboard() {
  useTitle('Overview | Neohabit');

  return (
    <div className="contentlist">
      <Overview />
    </div>
  );
}
