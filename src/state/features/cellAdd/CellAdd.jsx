import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import DataPointForm from '../../../components/DataPointForm';
import { useUpdateHeatmapMutation } from '../../services/heatmap';

export default function CellAdd() {
  const [updateHeatmap] = useUpdateHeatmapMutation();
  const { heatmapID } = useSelector((state) => ({
    heatmapID: state.cellAdd.heatmapID,
  }));
  useEffect(() => {
    document.addEventListener('click', () => document.querySelector('.cell-add-dropdown').classList.add('hidden'));
  });
  const onSubmit = async (values) => {
    await updateHeatmap({ heatmapID, values });
    document.querySelector('.cell-add-dropdown').classList.add('hidden');
  };

  return (
    <div
      className="cell-add-dropdown centering hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <DataPointForm onSubmit={onSubmit} />
    </div>
  );
}
