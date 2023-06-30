import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import {
  mdiHome,
  mdiFamilyTree,
  mdiTrendingUp,
  mdiCheckboxMultipleMarked,
  mdiPost,
  mdiCog,
  mdiChevronDown,
  mdiPlus,
} from '@mdi/js';
import { useGetFiltersQuery } from '../state/services/todolist';
import { useGetProjectsQuery } from '../state/services/project';
import ProjectTag from './ProjectTag';
import { changeTo, open } from '../state/features/projectOverlay/projectOverlaySlice';

export default function Sidebar(props) {
  const projects = useGetProjectsQuery();
  const filters = useGetFiltersQuery();
  const dispatch = useDispatch();
  const { hidden } = props;
  const [projectsCollapsed, setProjectsCollapsed] = useState(false);

  const toggleProjectsCollapsed = () => {
    setProjectsCollapsed(!projectsCollapsed);
  };

  const openOverlay = () => {
    dispatch(open());
    dispatch(changeTo(''));
  };

  return (
    <aside className={hidden ? 'sidebar sidebar-hidden' : 'sidebar'}>
      <ul className="navigation">
        <NavigationSection
          path={mdiHome}
          title={hidden ? 'Home' : 'Dashboard'}
          status="raw"
          to="/dashboard"
          raw="true"
        />
        <NavigationSection
          path={mdiFamilyTree}
          title={hidden ? 'Skills' : 'Skill trees'}
          status="soon"
          to="/skill-trees"
        />
        <NavigationSection
          path={mdiTrendingUp}
          title="Habits"
          status="raw"
          to="/habits"
          raw="true"
        />
        <NavigationSection
          path={mdiCheckboxMultipleMarked}
          title="To-do"
          to="/todo"
        />
        <NavigationSection
          path={mdiPost}
          title="Blog"
          status="soon"
          to="/blog"
        />
        <NavigationSection
          path={mdiCog}
          title="Settings"
          to="/settings"
        />
      </ul>
      <hr />
      <ul className="projects">
        <li className="projects-header">
          <p>Projects</p>
          <button className="centering" onClick={toggleProjectsCollapsed}>
            <Icon
              className={`icon projects-arrow ${
                projectsCollapsed ? '' : 'active'
              }`}
              path={mdiChevronDown}
            />
          </button>
          <button className="centering" onClick={openOverlay}>
            <Icon path={mdiPlus} className="icon" />
          </button>
        </li>
        <ul
          className={`projects-container ${projectsCollapsed ? '' : 'active'}`}
        >
          {projects.isFetching ? (
            <div className="projects-loader">
              <div className="loader" />
            </div>
          ) : (
            projects.data.map((project, i) => (
              <li key={`project-${i}`}>
                <Project project={project} />
              </li>
            ))
          )}
        </ul>
      </ul>
    </aside>
  );
}

function NavigationSection(props) {
  const { path, to, title, status, raw } = props;
  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          isActive ? 'navigation-section active' : 'navigation-section'
        }
        tabIndex="0"
        to={to}
      >
        <Icon path={path} className="icon" />
        <p className="link">{title}</p>
        <div className={`ribbon ribbon-top ${raw ? 'ribbon-raw' : ''}`}>
          <span>{status}</span>
        </div>
      </NavLink>
    </li>
  );
}

function Project(props) {
  const { project } = props;

  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <NavLink
      className={({ isActive }) => (isActive ? 'project active' : 'project')}
      to={`project/${linkify(project._id)}`}
      style={{
        backgroundColor: ({ isActive }) =>
          isActive ? `${project.color}33` : '',
      }}
    >
      <ProjectTag project={project} />
    </NavLink>
  );
}
