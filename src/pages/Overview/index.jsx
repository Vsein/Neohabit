import React from 'react';
import Icon from '@mdi/react';
import { useDispatch } from 'react-redux';
import { mdiPlus } from '@mdi/js';
import Overview from '../../components/Overview';
import useTitle from '../../hooks/useTitle';
import useKeyPress from '../../hooks/useKeyPress';
import { changeTo, open } from '../../state/features/projectOverlay/projectOverlaySlice';

export default function Dashboard() {
  useTitle('Dashboard | Neohabit');
  const dispatch = useDispatch();

  const openOverlay = () => {
    dispatch(open());
    dispatch(changeTo(''));
  };

  useKeyPress(['a'], openOverlay);

  return (
    <div id="content-overview">
      <div className="overview-controls"></div>
      <div className="overview-centering">
        <div className="overview-container">
          <Overview />
        </div>
        <button className="overview-project-add" onClick={openOverlay} title="Add project [A]">
          <Icon className="icon small" path={mdiPlus} />
          <p>Add project</p>
        </button>
      </div>
    </div>
  );
}
