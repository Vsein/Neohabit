import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../state/features/stopwatchFullscreen/stopwatchFullscreenSlice';
import { useGetStopwatchQuery } from '../state/services/stopwatch';
import useKeyPress from '../hooks/useKeyPress';
import useStopwatch from '../hooks/useStopwatch';

export default function StopwatchFullscreen() {
  const stopwatch = useGetStopwatchQuery();
  const dispatch = useDispatch();
  const { isActive } = useSelector((state) => state.stopwatchFullscreen);

  const closeOverlay = (e) => {
    e.stopPropagation();
    dispatch(close());
  };

  useKeyPress(['c'], closeOverlay);

  return (
    <div className={isActive ? 'overlay overlay-active' : 'overlay'} onMouseDown={closeOverlay}>
      <div
        className="modal modal-active"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      ></div>
    </div>
  );
}
