import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import Storage from '../modules/Storage';

export default function Sidebar() {
  const [projectsCollapsed, setProjectsCollapsed] = useState(false);

  const toggleProjectsCollapsed = () => {
    setProjectsCollapsed(!projectsCollapsed);
  };

  return (
    <div className="sidebar">
      <div className="filters">
        {Storage.getToDoList()
          .getFilters()
          .map((filter, i) => (
            <Filter
              filter={filter}
              key={`filter-${i}`}
            />
          ))}
      </div>
      <div className="projects">
        <div className="projects-header">
          <p>Projects</p>
          <Icon
            className={`icon projects-arrow ${projectsCollapsed ? '' : 'active'}`}
            path={mdiChevronDown}
            onClick={toggleProjectsCollapsed}
          />
        </div>
        <div
          className={`projects-container ${projectsCollapsed ? '' : 'active'}`}
        >
          {Storage.getToDoList()
            .getProjects()
            .map((project, i) => (
              <Project
                project={project}
                key={`project-${i}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function Project(props) {
  const { project } = props;

  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <NavLink
      className={({ isActive }) => (isActive ? 'project active' : 'project')}
      to={`/${linkify(project.name)}`}
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
        <div className="neohabit" />
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
      to={`/${linkify(filter.name)}`}
    >
      <img src={filter.image} height="20px" width="20px" />
      <p>{filter.name}</p>
    </NavLink>
  );
}
