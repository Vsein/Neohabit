import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetProjectsQuery } from '../state/services/project';
import { changeTo, open } from '../state/features/projectOverlay/projectOverlaySlice';
import useLoaded from '../hooks/useLoaded';
import Project from './Project';
import useKeyPress from '../hooks/useKeyPress';
import useDefaultProject from '../hooks/useDefaultProject';

export default function Overview() {
  const [loaded] = useLoaded();
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const vertical = false;

  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(open());
    dispatch(changeTo(''));
  };

  const [defaultProject] = useDefaultProject();

  if (!loaded || projects.isFetching || habits.isFetching) {
    return (
      <div className="overview-loader centering">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="contentlist">
      {projects.data && projects.data.map((project, i) => (
        <Project key={i} project={project} />
      ))}
      <Project project={defaultProject} />
      <div className="overview-centering" style={{ '--length': 46 }}>
        <button
          className={`overview-habit-add standalone ${vertical ? 'vertical' : ''}`}
          onClick={openOverlay}
          title="Add a new habit [A]"
        >
          <Icon className="icon small" path={mdiPlus} />
          <p>Add a new project</p>
        </button>
      </div>
    </div>
  );
}
