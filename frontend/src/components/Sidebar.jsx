import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Icon } from '@mdi/react';
import {
  mdiFamilyTree,
  mdiTrendingUp,
  mdiPackageVariantClosed,
  mdiCog,
  mdiChevronDown,
  mdiPlus,
  mdiClipboardCheck,
} from '@mdi/js';
import { useGetProjectsQuery } from '../state/services/project';
import { useGetHabitsOutsideProjectsQuery } from '../state/services/habit';
import { HabitTag } from './UI';
import { changeTo, close } from '../state/features/overlay/overlaySlice';
import useDefaultProject from '../hooks/useDefaultProject';

export default function Sidebar({ hidden }) {
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsOutsideProjectsQuery();
  const dispatch = useDispatch();
  const [projectsCollapsed, setProjectsCollapsed] = useState(false);

  const toggleProjectsCollapsed = () => {
    setProjectsCollapsed(!projectsCollapsed);
  };

  const { type, isActive } = useSelector((state) => state.overlay);
  const openOverlay = () => {
    if (type === 'project' && isActive) {
      dispatch(close());
    } else {
      dispatch(changeTo({ projectID: '', habitID: '', type: 'project' }));
    }
  };
  useHotkeys('shift+p', openOverlay);

  const [defaultProject] = useDefaultProject();

  return (
    <aside className={hidden ? 'sidebar sidebar-hidden' : 'sidebar'}>
      <ul className="navigation">
        <NavigationSection path={mdiTrendingUp} title="Projects" to="/projects" num="1" />
        <NavigationSection
          path={mdiFamilyTree}
          title={hidden ? 'Skills' : 'Skill trees'}
          to="/skills"
          num="2"
        />
        <NavigationSection
          path={mdiClipboardCheck}
          title="To-do"
          to="/todo"
          status="raw"
          raw
          num="3"
        />
        <NavigationSection
          path={mdiPackageVariantClosed}
          title="Blocks"
          status="soon"
          to="/blocks"
          num="4"
        />
        <NavigationSection path={mdiCog} title="Settings" to="/settings" num="5" />
      </ul>
      <hr />
      <ul className="sidebar-projects">
        <li className="sidebar-projects-header">
          <button className="centering" onClick={toggleProjectsCollapsed}>
            <Icon
              className={`icon sidebar-projects-arrow ${projectsCollapsed ? '' : 'active'}`}
              path={mdiChevronDown}
            />
          </button>
          <p>Projects</p>
          <button className="centering" onClick={openOverlay} title="Add project [A]">
            <Icon path={mdiPlus} className="icon" />
          </button>
        </li>
        <ul className={`sidebar-projects-container ${projectsCollapsed ? '' : 'active'}`}>
          {projects.isFetching || habits.isFetching ? (
            <div className="sidebar-projects-loader">
              <div className="loader" />
            </div>
          ) : (
            <>
              {projects.data.map((project, i) => (
                <ProjectSidebar key={`project-${i}`} project={project} />
              ))}
              {defaultProject.habits.length ? <ProjectSidebar project={defaultProject} /> : <></>}
            </>
          )}
        </ul>
      </ul>
    </aside>
  );
}

function NavigationSection({ path, to, title, status, raw, num }) {
  const navigate = useNavigate();

  useHotkeys(num, () => navigate(to));

  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          isActive ? 'navigation-section active' : 'navigation-section'
        }
        tabIndex="0"
        to={to}
        title={`${title} [${num}]`}
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

function ProjectSidebar({ project }) {
  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();
  const [habitsCollapsed, setHabitsCollapsed] = useState(true);

  const toggleHabitsCollapsed = () => {
    setHabitsCollapsed(!habitsCollapsed);
  };

  return (
    <ul
      className="sidebar-habits"
      style={{
        '--sidebar-main-color': project.color,
        '--sidebar-dim-color': `${project.color}40`,
        '--sidebar-muted-color': `${project.color}40`,
      }}
    >
      <li className="sidebar-habits-header">
        <button className="centering" onClick={toggleHabitsCollapsed}>
          <Icon
            className={`icon small habit-circle sidebar-habits-arrow ${
              habitsCollapsed ? '' : 'active'
            }`}
            path={mdiChevronDown}
          />
        </button>
        <NavLink
          className={({ isActive }) => (isActive ? 'sidebar-project active' : 'sidebar-project')}
          to={`project/${linkify(project.id)}`}
          title={project.name}
        >
          <p>{project.name}</p>
        </NavLink>
      </li>
      <ul className={`sidebar-habits-container ${habitsCollapsed ? '' : 'active'}`}>
        {project.habits &&
          project.habits.map((habit, i) => (
            <NavLink key={i} className="habit" to={`habit/${linkify(habit.id)}`} title={habit.name}>
              <HabitTag key={i} habit={habit} />
            </NavLink>
          ))}
      </ul>
    </ul>
  );
}
