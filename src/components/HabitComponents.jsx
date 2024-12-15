import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
  mdiKeyboardReturn,
} from '@mdi/js';
import { useUpdateHeatmapMutation } from '../state/services/heatmap';
import { useUpdateProjectMutation } from '../state/services/project';
import { changeHeatmapTo } from '../state/features/cellAdd/cellAddSlice';
import { changeTo } from '../state/features/overlay/overlaySlice';
import { useUpdateStopwatchMutation } from '../state/services/stopwatch';
import { getUTCOffsettedDate } from '../utils/dates';

import Heatmap from './Heatmap';

function HabitControls({
  habit,
  heatmapID,
  header,
  mobile,
  projectID = '',
  modal = false,
  habitPage = false,
}) {
  const [updateStopwatch] = useUpdateStopwatchMutation();
  const [updateHeatmap] = useUpdateHeatmapMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const setStopwatchHabit = () => {
    updateStopwatch({
      values: {
        habit,
      },
    });
    dispatch(changeTo({ type: 'stopwatch' }));
  };
  const addCell = async () => {
    await updateHeatmap({
      heatmapID,
      values: { value: 1, date: getUTCOffsettedDate() },
    });
  };
  const openCellAddDropdown = (e, isTarget) => {
    e.stopPropagation();
    dispatch(changeHeatmapTo({ heatmapID, isActive: true, isTarget }));
    const cellAddDropdown = document.querySelector('.cell-add-dropdown');
    cellAddDropdown.classList.toggle('hidden');
    const cell = e.target;
    const rect = cell.getBoundingClientRect();
    const { innerWidth: width } = window;
    if (width <= 850) {
      cellAddDropdown.style.top = `${window.pageYOffset + rect.y + 26}px`;
      cellAddDropdown.style.left = `${rect.x - (isTarget ? 165 : 113) + (width < 400 ? 25 : 0)}px`;
    } else {
      cellAddDropdown.style.top = `${window.pageYOffset + rect.y - 21 - (isTarget ? 10 : 0)}px`;
      cellAddDropdown.style.left = `${rect.x + window.scrollX + rect.width / 2 - 245 - (isTarget ? 100 : 0)}px`;
    }
    cellAddDropdown.style.setProperty('--border-color', habit.color);
  };

  return mobile ? (
    <div className={`habit-controls ${header ? 'header' : ''}`} style={{ '--color': habit.color }}>
      <button
        className="overview-habit-button"
        onClick={addCell}
        title="Add 1 completed action today"
        type="button"
      >
        <Icon path={mdiCheckboxMarked} />
      </button>
    </div>
  ) : (
    <div
      className={`habit-controls right ${header ? 'header' : ''}`}
      style={{ '--color': habit.color }}
    >
      <button
        className="overview-habit-button"
        onClick={addCell}
        title="Add 1 completed action today"
        type="button"
      >
        <Icon path={mdiCheckboxMarked} />
      </button>
      <button
        className="overview-habit-button"
        onClick={(e) => openCellAddDropdown(e, false)}
        title="Add N copmleted actions on X day"
        type="button"
      >
        <Icon path={mdiCheckboxMultipleMarked} />
      </button>
      <button
        className="overview-habit-button"
        onClick={(e) => openCellAddDropdown(e, true)}
        title="Add a new target"
        type="button"
      >
        <Icon path={mdiViewGridPlusOutline} />
      </button>
      <button
        className="overview-habit-button"
        onClick={setStopwatchHabit}
        title="Start stopwatch of this habit"
        type="button"
      >
        <Icon path={mdiTimer} />
      </button>
      {!modal && (
        <button
          className="overview-habit-button"
          onClick={() => dispatch(changeTo({ habitID: habit._id, projectID, type: 'habit' }))}
          title="Edit habit"
          type="button"
        >
          <Icon path={mdiPencil} />
        </button>
      )}
      <button
        className="overview-habit-button"
        onClick={() => {
          dispatch(changeTo({ habitID: habit._id, projectID, type: 'deleteHabit' }));
          if (habitPage) {
            navigate('/projects');
          }
        }}
        title="Delete habit"
        type="button"
      >
        <Icon path={mdiDelete} />
      </button>
    </div>
  );
}

function HabitOverview({
  dateStart,
  dateEnd,
  habit,
  heatmapData,
  heatmapID,
  vertical,
  mobile,
  projectID = '',
  dragHabitInProject,
}) {
  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  const allowDrop = (e) => {
    e.preventDefault();
  }

  const drag = (e) => {
    e.dataTransfer.setData("text", e.target.id);
  }

  const drop = async (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    const draggedHabit = document.getElementById(id);

    if (!draggedHabit || !draggedHabit.classList.contains('overview-habit')) {
      return;
    };

    const target = e.target.closest('.overview-habit')

    if (target.id === id) {
      return;
    }

    const draggedFromProjectID = draggedHabit.closest('.overview-centering').id;
    const draggedToProjectID = target.closest('.overview-centering').id;

    if (draggedFromProjectID === draggedToProjectID) {
      await dragHabitInProject(draggedFromProjectID, draggedHabit.id, target.id, target.offsetTop >= draggedHabit.offsetTop);
    } else {
      const draggedFromProject = document.getElementById(draggedFromProjectID);
      const fromHabits = draggedFromProject.querySelector('.overview-habits');

      const draggedToProject = document.getElementById(draggedToProjectID);
      const toHabits = draggedToProject.querySelector('.overview-habits');

      fromHabits.removeChild(draggedHabit);
      toHabits.appendChild(draggedHabit);

      if (target.offsetTop < draggedHabit.offsetTop) {
        toHabits.insertBefore(draggedHabit, target);
      } else {
        const dropTo = target.nextSibling;
        toHabits.insertBefore(draggedHabit, dropTo);
      }

      draggedFromProject.style.setProperty('--habits', draggedFromProject.style.getPropertyValue('--habits') - 1);
      draggedToProject.style.setProperty('--habits', +draggedToProject.style.getPropertyValue('--habits') + 1)
    }
  }

  return (
    <div
      className="overview-habit"
      onDrop={drop}
      onDragOver={allowDrop} draggable onDragStart={drag}
      id={habit?._id}
    >
      <NavLink
        className="overview-habit-name"
        to={`../habit/${linkify(habit._id)}`}
        title={habit.name}
      >
        {habit.name}
      </NavLink>
      <Heatmap
        heatmapData={heatmapData}
        heatmapID={heatmapID}
        habit={habit}
        dateStart={dateStart}
        dateEnd={dateEnd}
        vertical={vertical}
        isOverview={true}
      />
      <HabitControls habit={habit} heatmapID={heatmapID} mobile={mobile} projectID={projectID} />
    </div>
  );
}

function HabitAddButton({ projectID = '', standalone = false }) {
  const dispatch = useDispatch();

  return (
    <button
      className="overview-open-settings active right"
      style={{
        transform: 'scale(1.25)',
        [standalone ? '' : 'marginRight']: '3px',
        width: 'min-content',
      }}
      onClick={() => dispatch(changeTo({ habitID: '', projectID, type: 'habit' }))}
      title="Add a new habit"
      type="button"
    >
      <Icon path={mdiPlus} className="icon small centering" />
    </button>
  );
}

function ReturnButton() {
  const navigate = useNavigate();

  return (
    <Link onClick={() => navigate(-1)} className="left return-button centering">
      <Icon className="icon small" path={mdiKeyboardReturn} />
    </Link>
  );
}

export { HabitControls, HabitOverview, HabitAddButton, ReturnButton };
