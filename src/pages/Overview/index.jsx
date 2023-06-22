import React from 'react';
import Icon from '@mdi/react';
import { subMonths, startOfDay } from 'date-fns';
import PFP from '../../components/ProfilePicture';
import Overview from '../../components/Overview';
import useTitle from '../../hooks/useTitle';

export default function Dashboard() {
  useTitle('Dashboard | Neohabit');
  const dateEnd = startOfDay(new Date());
  const dateStart = subMonths(dateEnd, 1);

  return (
    <div id="content-overview">
      <div className="overview-controls">
      </div>
      <div className="overview-centering">
        <div className="overview-container">
          <Overview dateStart={dateStart} dateEnd={dateEnd} />
        </div>
      </div>
    </div>
  );
}
