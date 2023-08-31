import React from 'react';
import Overview from '../../components/Overview';
import useTitle from '../../hooks/useTitle';

export default function Dashboard() {
  useTitle('Dashboard | Neohabit');

  return (
    <div id="content-overview">
      <div className="overview-controls"></div>
      <div className="overview-centering">
        <Overview />
      </div>
    </div>
  );
}
