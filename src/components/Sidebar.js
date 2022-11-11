import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import ProjectTag from './ProjectTag';
import {
  mdiHome,
  mdiFamilyTree,
  mdiTrendingUp,
  mdiCheckboxMultipleMarked,
  mdiPost,
  mdiCog,
  mdiMenu,
  mdiApps,
} from '@mdi/js';

export default function Sidebar(props) {
  const { hidden, filters, projects } = props;
  const [projectsCollapsed, setProjectsCollapsed] = useState(false);

  const toggleProjectsCollapsed = () => {
    setProjectsCollapsed(!projectsCollapsed);
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
          status="soon"
          to="/settings"
        />
      </ul>
      <ul className="filters">
        {filters.map((filter, i) => (
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
              className={`icon projects-arrow ${
                projectsCollapsed ? '' : 'active'
              }`}
              path={mdiChevronDown}
            />
          </button>
        </li>
        <ul
          className={`projects-container ${projectsCollapsed ? '' : 'active'}`}
        >
          {projects.map((project, i) => (
            <li key={`project-${i}`}>
              <Project project={project} />
            </li>
          ))}
        </ul>
      </ul>
    </aside>
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
