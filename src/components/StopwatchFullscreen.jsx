import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../state/features/stopwatchFullscreen/stopwatchFullscreenSlice';
import useKeyPress from '../hooks/useKeyPress';

export default function StopwatchFullscreen() {
  const dispatch = useDispatch();
  const { isActive } = useSelector((state) => state.stopwatchFullscreen);

  const closeOverlay = (e) => {
    e.stopPropagation();
    dispatch(close());
  };

  useKeyPress(['c'], closeOverlay);

  return (
    <div className={isActive ? 'overlay overlay-active' : 'overlay'} onClick={closeOverlay}>
      <div className="modal modal-active" onClick={(e) => e.stopPropagation()}></div>
    </div>
  );
}
