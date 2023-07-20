import React from 'react';
import Icon from '@mdi/react';
import { useDispatch } from 'react-redux';
import { mdiPlus } from '@mdi/js';
import { subMonths, startOfDay } from 'date-fns';
import PFP from '../../components/ProfilePicture';
import Overview from '../../components/Overview';
import useTitle from '../../hooks/useTitle';
import { changeTo, open } from '../../state/features/projectOverlay/projectOverlaySlice';

export default function Dashboard() {
  useTitle('Dashboard | Neohabit');
  const dispatch = useDispatch();
  const dateEnd = startOfDay(new Date());
  const dateStart = subMonths(dateEnd, 1);

  const openOverlay = () => {
    dispatch(open());
    dispatch(changeTo(''));
  };

  return (
    <div id="content-overview">
      <div className="overview-controls">
      </div>
      <div className="overview-centering">
        <div className="overview-container">
          <Overview dateStart={dateStart} dateEnd={dateEnd} />
        </div>
        <button className="overview-project-add" onClick={openOverlay} >
          <Icon className="icon small" path={mdiPlus} />
          <p>Add project</p>
        </button>
      </div>
    </div>
  );
}
