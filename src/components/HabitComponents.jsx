import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import {
  mdiDelete,
  mdiPencil,
  mdiPlusBox,
  mdiTimer,
  mdiCheckboxMarked,
  mdiViewGridPlusOutline,
} from '@mdi/js';
import { useDeleteHabitMutation } from '../state/services/habit';
import { useUpdateHeatmapMutation } from '../state/services/heatmap';
import { changeHeatmapTo } from '../state/features/cellAdd/cellAddSlice';
import { changeTo, open } from '../state/features/habitOverlay/habitOverlaySlice';
import { useUpdateStopwatchMutation } from '../state/services/stopwatch';

export default function HabitControls({ habit, heatmap, header }) {
  const [deleteHabit] = useDeleteHabitMutation();
  const [updateStopwatch] = useUpdateStopwatchMutation();
  const [updateHeatmap] = useUpdateHeatmapMutation();
  const dispatch = useDispatch();
  const deleteChosenHabit = () => {
    deleteHabit(habit._id);
  };
  const setStopwatchHabit = () => {
    updateStopwatch({
      values: {
        habit,
      },
    });
  };
  const addCell = async () => {
    await updateHeatmap({
      heatmapID: heatmap?._id,
      values: { value: 1, date: Date.now() },
    });
  };
  const openCellAddDropdown = (e, isTarget) => {
    e.stopPropagation();
    dispatch(changeHeatmapTo({ heatmapID: heatmap?._id, isActive: true, isTarget }));
    const cellAddDropdown = document.querySelector('.cell-add-dropdown');
    const cell = e.target;
    const rect = cell.getBoundingClientRect();
    cellAddDropdown.style.top = `${window.pageYOffset + rect.y - 21 - (isTarget ? 10 : 0)}px`;
    cellAddDropdown.style.left = `${rect.x + rect.width / 2 - 245 - (isTarget ? 100 : 0)}px`;
    cellAddDropdown.style.borderColor = habit.color;
  };

  return (
    <div className={`habit-controls ${header ? 'header' : ''}`} style={{ '--color': habit.color }}>
      <button
        className="overview-habit-button"
        onClick={(e) => openCellAddDropdown(e, false)}
        title="Add N copmleted actions on X day"
      >
        <Icon path={mdiPlusBox} />
      </button>
      <button
        className="overview-habit-button"
        onClick={addCell}
        title="Add 1 completed action today"
      >
        <Icon path={mdiCheckboxMarked} />
      </button>
      <button
        className="overview-habit-button"
        onClick={setStopwatchHabit}
        title="Start stopwatch of this habit"
      >
        <Icon path={mdiTimer} />
      </button>
      <button
        className="overview-habit-button"
        onClick={(e) => openCellAddDropdown(e, true)}
        title="Add a new target"
      >
        <Icon path={mdiViewGridPlusOutline} />
      </button>
      <Link
        className="overview-habit-button"
        onClick={() => {
          dispatch(changeTo(habit._id));
          dispatch(open());
        }}
        title="Edit habit"
      >
        <Icon path={mdiPencil} />
      </Link>
      <button
        className="overview-habit-button"
        onClick={deleteChosenHabit}
        title="Delete habit"
      >
        <Icon path={mdiDelete} />
      </button>
    </div>
  );
}
