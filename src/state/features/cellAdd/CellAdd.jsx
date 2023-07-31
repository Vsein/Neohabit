import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import DataPointForm from '../../../components/DataPointForm';
import TargetPointForm from '../../../components/TargetPointForm';
import { useUpdateHeatmapMutation } from '../../services/heatmap';

export default function CellAdd() {
  const [updateHeatmap] = useUpdateHeatmapMutation();
  const { heatmapID } = useSelector((state) => ({
    heatmapID: state.cellAdd.heatmapID,
  }));
  const { isTarget } = useSelector((state) => ({
    isTarget: state.cellAdd.isTarget,
  }));
  useEffect(() => {
    document.addEventListener('click', () =>
      document.querySelector('.cell-add-dropdown').classList.add('hidden'),
    );
  });
  const onSubmit = async (values) => {
    await updateHeatmap({ heatmapID, values });
    document.querySelector('.cell-add-dropdown').classList.add('hidden');
  };

  return isTarget ? (
    <div
      className="cell-add-dropdown target centering hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Add new target</h3>
      <TargetPointForm onSubmit={onSubmit} />
    </div>
  ) : (
    <div
      className="cell-add-dropdown centering hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Add completed actions</h3>
      <DataPointForm onSubmit={onSubmit} />
    </div>
  );
}
