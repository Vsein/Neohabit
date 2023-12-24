import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import {
  mdiDelete,
  mdiPencil,
  mdiTimer,
  mdiCheckboxMarked,
  mdiCheckboxMultipleMarked,
  mdiViewGridPlusOutline,
  mdiPlus,
} from '@mdi/js';
import { useUpdateHeatmapMutation } from '../state/services/heatmap';
import { changeHeatmapTo } from '../state/features/cellAdd/cellAddSlice';
import { changeTo } from '../state/features/overlay/overlaySlice';
import { useUpdateStopwatchMutation } from '../state/services/stopwatch';
import Heatmap from './Heatmap';

function HabitControls({ habit, heatmap, header, mobile, projectID = '' }) {
  const [updateStopwatch] = useUpdateStopwatchMutation();
  const [updateHeatmap] = useUpdateHeatmapMutation();
  const dispatch = useDispatch();
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
    cellAddDropdown.style.setProperty('--border-color', habit.color);
  };

  return mobile ? (
    <div className={`habit-controls ${header ? 'header' : ''}`} style={{ '--color': habit.color }}>
      <button
        className="overview-habit-button"
        onClick={addCell}
        title="Add 1 completed action today"
      >
        <Icon path={mdiCheckboxMarked} />
      </button>
    </div>
  ) : (
    <div className={`habit-controls right ${header ? 'header' : ''}`} style={{ '--color': habit.color }}>
      <button
        className="overview-habit-button"
        onClick={addCell}
        title="Add 1 completed action today"
      >
        <Icon path={mdiCheckboxMarked} />
      </button>
      <button
        className="overview-habit-button"
        onClick={(e) => openCellAddDropdown(e, false)}
        title="Add N copmleted actions on X day"
      >
        <Icon path={mdiCheckboxMultipleMarked} />
      </button>
      <button
        className="overview-habit-button"
        onClick={(e) => openCellAddDropdown(e, true)}
        title="Add a new target"
      >
        <Icon path={mdiViewGridPlusOutline} />
      </button>
      <button
        className="overview-habit-button"
        onClick={setStopwatchHabit}
        title="Start stopwatch of this habit"
      >
        <Icon path={mdiTimer} />
      </button>
      <Link
        className="overview-habit-button"
        onClick={() => dispatch(changeTo({ habitID: habit._id, projectID, type: 'habit' }))}
        title="Edit habit"
      >
        <Icon path={mdiPencil} />
      </Link>
      <button
        className="overview-habit-button"
        onClick={() => dispatch(changeTo({ habitID: habit._id, projectID, type: 'deleteHabit' }))}
        title="Delete habit"
      >
        <Icon path={mdiDelete} />
      </button>
    </div>
  );
}

function HabitOverview({ dateStart, dateEnd, habit, heatmap, vertical, mobile, projectID = '' }) {
  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="overview-habit">
      <NavLink
        className="overview-habit-name"
        to={`../habit/${linkify(habit._id)}`}
        title={habit.name}
      >
        {habit.name}
      </NavLink>
      <Heatmap
        heatmap={heatmap}
        habit={habit}
        dateStart={dateStart}
        dateEnd={dateEnd}
        vertical={vertical}
        isOverview={true}
      />
      <HabitControls habit={habit} heatmap={heatmap} mobile={mobile} projectID={projectID} />
    </div>
  );
}

function HabitAddButton({ vertical, projectID = '' }) {
  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(changeTo({ habitID: '', projectID, type: 'habit' }));
  };

  return (
    <button
      className={`overview-habit-add ${vertical ? 'vertical' : ''}`}
      onClick={openOverlay}
      title="Add a new habit [A]"
    >
      <Icon className="icon small" path={mdiPlus} />
      <p>Add a new habit</p>
    </button>
  );
}

export { HabitControls, HabitOverview, HabitAddButton };
