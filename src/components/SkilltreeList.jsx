import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { useGetSkilltreesQuery } from '../state/services/skilltree';
import { changeTo } from '../state/features/overlay/overlaySlice';
import useLoaded from '../hooks/useLoaded';
import Skilltree from './Skilltree';
import useKeyPress from '../hooks/useKeyPress';

export default function SkilltreeList() {
  const [loaded] = useLoaded();
  const skilltrees = useGetSkilltreesQuery();
  const vertical = false;

  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(changeTo({ projectID: '', skilltreeID: '', type: 'skilltree' }));
  };

  if (!loaded || skilltrees.isFetching) {
    return (
      <div className="overview-loader centering">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="contentlist">
      {skilltrees.data && skilltrees.data.map((skilltree, i) => (
        <Skilltree key={i} skilltree={skilltree} />
      ))}
      <div className="overview-centering" style={{ '--length': 47 }}>
        <button
          className={`overview-habit-add standalone ${vertical ? 'vertical' : ''}`}
          onClick={openOverlay}
          title="Add a new skilltree [A]"
        >
          <Icon className="icon small" path={mdiPlus} />
          <p>Add a new skilltree</p>
        </button>
      </div>
    </div>
  );
}
