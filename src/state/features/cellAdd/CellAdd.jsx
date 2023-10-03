import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataPointForm from '../../../components/DataPointForm';
import TargetPointForm from '../../../components/TargetPointForm';
import { useUpdateHeatmapMutation } from '../../services/heatmap';
import { close } from './cellAddSlice';

export default function CellAdd() {
  const dispatch = useDispatch();
  const [updateHeatmap] = useUpdateHeatmapMutation();
  const { heatmapID, isTarget, isActive } = useSelector((state) => state.cellAdd);
  const closeDropdown = () => {
    dispatch(close());
    const cellAddDropdown = document.querySelector('.cell-add-dropdown');
    cellAddDropdown.style.top = '0px';
    cellAddDropdown.style.left = '0px';
  };
  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  });
  const onSubmit = async (values) => {
    await updateHeatmap({ heatmapID, values });
    closeDropdown();
  };

  return isTarget ? (
    <div
      className={`cell-add-dropdown target centering ${isActive ? '' : 'hidden'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Add new target</h3>
      <TargetPointForm onSubmit={onSubmit} />
    </div>
  ) : (
    <div
      className={`cell-add-dropdown centering ${isActive ? '' : 'hidden'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Add completed actions</h3>
      <DataPointForm onSubmit={onSubmit} />
    </div>
  );
}
