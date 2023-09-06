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
import { useDeleteProjectMutation } from '../state/services/project';
import { useUpdateHeatmapMutation } from '../state/services/heatmap';
import { changeHeatmapTo } from '../state/features/cellAdd/cellAddSlice';
import { changeTo, open } from '../state/features/projectOverlay/projectOverlaySlice';
import { useUpdateStopwatchMutation } from '../state/services/stopwatch';

export default function ProjectControls({ project, heatmap, header }) {
  const [deleteProject] = useDeleteProjectMutation();
  const [updateStopwatch] = useUpdateStopwatchMutation();
  const [updateHeatmap] = useUpdateHeatmapMutation();
  const dispatch = useDispatch();
  const deleteChosenProject = () => {
    deleteProject(project._id);
  };
  const setStopwatchProject = () => {
    updateStopwatch({
      values: {
        project,
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
    cellAddDropdown.style.borderColor = project.color;
  };

  return (
    <div className={`project-controls ${header ? 'header' : ''}`} style={{ '--color': project.color }}>
      <button
        className="overview-project-button"
        onClick={(e) => openCellAddDropdown(e, false)}
        title="Add N copmleted actions on X day"
      >
        <Icon path={mdiPlusBox} />
      </button>
      <button
        className="overview-project-button"
        onClick={addCell}
        title="Add 1 completed action today"
      >
        <Icon path={mdiCheckboxMarked} />
      </button>
      <button
        className="overview-project-button"
        onClick={setStopwatchProject}
        title="Start stopwatch of this project"
      >
        <Icon path={mdiTimer} />
      </button>
      <button
        className="overview-project-button"
        onClick={(e) => openCellAddDropdown(e, true)}
        title="Add a new target"
      >
        <Icon path={mdiViewGridPlusOutline} />
      </button>
      <Link
        className="overview-project-button"
        onClick={() => {
          dispatch(changeTo(project._id));
          dispatch(open());
        }}
        title="Edit project"
      >
        <Icon path={mdiPencil} />
      </Link>
      <button
        className="overview-project-button"
        onClick={deleteChosenProject}
        title="Delete project"
      >
        <Icon path={mdiDelete} />
      </button>
    </div>
  );
}
