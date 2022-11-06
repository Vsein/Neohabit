import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';

export default function Sidebar(props) {
  const { hidden, filters, projects, setId } = props;
  const [projectsCollapsed, setProjectsCollapsed] = useState(false);

  const toggleProjectsCollapsed = () => {
    setProjectsCollapsed(!projectsCollapsed);
  };

  return (
    <aside className={hidden ? 'sidebar sidebar-hidden' : 'sidebar'}>
      <ul className="filters">
        {
          filters
          .map((filter, i) => (
            <li key={`filter-${i}`}>
              <Filter filter={filter} />
            </li>
          ))}
      </ul>
      <ul className="projects">
        <li className="projects-header">
          <p>Projects</p>
          <button className="centering" onClick={toggleProjectsCollapsed}>
            <Icon
              className={`icon projects-arrow ${projectsCollapsed ? '' : 'active'}`}
              path={mdiChevronDown}
            />
          </button>
        </li>
        <ul
          className={`projects-container ${projectsCollapsed ? '' : 'active'}`}
        >
          {
            projects
            .map((project, i) => (
              <li key={`project-${i}`}>
                <Project project={project} setId={setId} />
              </li>
            ))
          }
        </ul>
      </ul>
    </aside>
  );
}

function Project(props) {
  const { project, setId } = props;

  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <NavLink
      className={({ isActive }) => (isActive ? 'project active' : 'project')}
      to={`project/${linkify(project._id)}`}
      style={{
        backgroundColor: ({ isActive }) => (isActive ? `${project.color}33` : '')
      }}
    >
      <div className="centering">
        <div
          className="project-circle"
          style={{ backgroundColor: project.color }}
        />
      </div>
      {project.name === 'Neohabit' ? (
        <p className="neohabit" />
      ) : (
        <p>{project.name}</p>
      )}
    </NavLink>
  );
}

function Filter(props) {
  const { filter } = props;

  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <NavLink
      className={({ isActive }) => (isActive ? 'filter active' : 'filter')}
      to={`${linkify(filter.name)}`}
    >
      <Icon path={filter.image} height="20px" width="20px" />
      <p>{filter.name}</p>
    </NavLink>
  );
}
