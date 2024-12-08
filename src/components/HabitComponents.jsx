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
}) {
  const [updateProject] = useUpdateProjectMutation();
  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  const allowDrop = (e) => {
    e.preventDefault();
  }

  const drag = (e) => {
    e.dataTransfer.setData("text", e.target.id);
  }

  const drop = async (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    const draggedHabit = document.getElementById(data);

    if (!draggedHabit.classList.contains('overview-habit')) {
      return;
    };

    const habitContainer = draggedHabit.parentNode;
    const target = e.target.closest('.overview-habit')

    const draggedFromProjectID = draggedHabit.closest('.overview-centering').id;
    const draggedToProjectID = target.closest('.overview-centering').id;

    if (draggedFromProjectID === draggedToProjectID) {
      if (target.offsetTop < draggedHabit.offsetTop) {
        habitContainer.insertBefore(draggedHabit, target);
      } else {
        const dropTo = target.nextSibling;
        habitContainer.insertBefore(draggedHabit, dropTo);
      }
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

//     await updateProject({projectID, values: { habits:
// [
//     "64b734495b24ad2131f6517a",
//     "64c59a558a128ff351fabd7d",
//     "6511e5d4756a3ef535ccc467",
//     "651b8b47963fca7bb3f68100",
//     "655fabfba8272bd54ee56699",
//     "6569a6cefc3c754bf476249a",
//     "6569a706fc3c754bf47624a3",
//     "6585840e72283235e67ba9c4",
//     "6588fdb6967d8876dbffdac6",
//     "65890288967d8876dbffdae0",
//     "65a116c34949c78ef996deb2",
//     "65ad5c1747075f5f1805dd10",
//     "65b0ed96a8ad6e0e96903989",
//     "65c8edba1fb07589c09f22a1",
//     "65d1d153f82360856f6da8da",
//     "65d79594f82360856f6dbedd",
//     "65d9d22ff82360856f6dda02"
// ]
//     }});

    const ids = [...habitContainer.querySelectorAll(':scope > .overview-habit')].map(({ id }) => id);
    console.log(ids);
    // await updateProject({ projectID, values: { habits: ids } });
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
