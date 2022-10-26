import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import Storage from '../modules/Storage';

export default function Sidebar() {
  const [currentFilter, setCurrentFilter] = useState('All');
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
              current={currentFilter}
              modify={setCurrentFilter}
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
                current={currentFilter}
                modify={setCurrentFilter}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function Project(props) {
  const { project, current, modify } = props;

  return (
    <div
      className={`project ${project.name === current ? 'active' : ''}`}
      onClick={() => modify(project.name)}
      style={{
        backgroundColor: project.name === current ? `${project.color}33` : '',
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
    </div>
  );
}

function Filter(props) {
  const { filter, current, modify } = props;

  return (
    <div
      className={`filter ${filter.name === current ? 'active' : ''}`}
      onClick={() => modify(filter.name)}
    >
      <img src={filter.image} height="20px" width="20px" />
      <p>{filter.name}</p>
    </div>
  );
}
