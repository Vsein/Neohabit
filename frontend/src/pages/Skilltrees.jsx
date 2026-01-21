import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook'
import { Icon } from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { useGetSkilltreesQuery } from '../state/services/skilltree';
import { changeTo, close } from '../state/features/overlay/overlaySlice';
import useLoaded from '../hooks/useLoaded';
import Skilltree from '../components/Skilltree';
import useTitle from '../hooks/useTitle';

export default function SkillsPage() {
  useTitle('Skilltrees | Neohabit');

  const [loaded] = useLoaded();
  const skilltrees = useGetSkilltreesQuery();
  const vertical = false;

  const { type, isActive } = useSelector((state) => state.overlay);
  const dispatch = useDispatch();
  const toggleSkilltreeOverlay = () => {
    if (type === 'skilltree' && isActive) {
      dispatch(close());
    } else {
      dispatch(changeTo({ projectID: '', skilltreeID: '', type: 'skilltree' }));
    }
  };
  useHotkeys('shift+s', toggleSkilltreeOverlay);

  if (!loaded || skilltrees.isFetching) {
    return <div className="loader" />;
  }

  return (
    <div className="contentlist">
      {skilltrees.data && skilltrees.data.map((skilltree, i) => (
        <Skilltree key={i} skilltree={skilltree} />
      ))}
      <div className="skilltree-centering" style={{ '--length': 47, alignItems: 'initial' }}>
        <button
          className={`overview-habit-add standalone ${vertical ? 'vertical' : ''}`}
          onClick={toggleSkilltreeOverlay}
          title="Add a new skilltree [S]"
        >
          <Icon className="icon small" path={mdiPlus} />
          <p>Add a new skilltree</p>
        </button>
      </div>
    </div>
  );
}
