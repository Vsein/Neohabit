import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
import { useGetProjectsQuery } from '../state/services/project';
import { useGetHabitsQuery } from '../state/services/habit';
import HabitTag from './HabitTag';
import { changeTo, open } from '../state/features/projectOverlay/projectOverlaySlice';
import useKeyPress from '../hooks/useKeyPress';
import useDefaultProject from '../hooks/useDefaultProject';

export default function Sidebar({ hidden, toggleSidebar }) {
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const dispatch = useDispatch();
  const [projectsCollapsed, setProjectsCollapsed] = useState(false);

  const toggleProjectsCollapsed = () => {
    setProjectsCollapsed(!projectsCollapsed);
  };

  const openOverlay = () => {
    dispatch(open());
    dispatch(changeTo({ projectID: '', habitID: '' }));
  };

  useKeyPress(['a'], openOverlay);

  const [defaultProject] = useDefaultProject();

  return (
    <>
      <div
        className={hidden ? 'overlay' : 'overlay overlay-active overlay-sidebar'}
        onMouseDown={toggleSidebar}
      />
      <aside className={hidden ? 'sidebar sidebar-hidden' : 'sidebar'}>
        <ul className="navigation">
          <NavigationSection
            path={mdiHome}
            title={hidden ? 'Home' : 'Dashboard'}
            status="raw"
            to="/dashboard"
            raw="true"
            num="1"
          />
          <NavigationSection
            path={mdiFamilyTree}
            title={hidden ? 'Skills' : 'Skill trees'}
            status="soon"
            to="/skill-trees"
            num="2"
          />
          <NavigationSection
            path={mdiTrendingUp}
            title="Projects"
            status="raw"
            to="/projects"
            raw="true"
            num="3"
          />
          <NavigationSection path={mdiCheckboxMultipleMarked} title="To-do" to="/todo" num="4" />
          <NavigationSection path={mdiPost} title="Blog" status="soon" to="/blog" num="5" />
          <NavigationSection path={mdiCog} title="Settings" to="/settings" num="6" />
        </ul>
        <hr />
        <ul className="habits">
          <li className="habits-header">
            <button className="centering" onClick={toggleProjectsCollapsed}>
              <Icon
                className={`icon habits-arrow ${projectsCollapsed ? '' : 'active'}`}
                path={mdiChevronDown}
              />
            </button>
            <p>Projects</p>
            <button className="centering add" onClick={openOverlay} title="Add project [A]">
              <Icon path={mdiPlus} className="icon" />
            </button>
          </li>
          <ul className={`habits-container ${projectsCollapsed ? '' : 'active'}`}>
            {projects.isFetching || habits.isFetching ? (
              <div className="habits-loader">
                <div className="loader" />
              </div>
            ) : (
              <>
                {projects.data.map((project, i) => (
                  <li key={`project-${i}`}>
                    <Project project={project} />
                  </li>
                ))}
                <li>
                  <Project project={defaultProject} />
                </li>
              </>
            )}
          </ul>
        </ul>
      </aside>
    </>
  );
}

function NavigationSection(props) {
  const { path, to, title, status, raw, num } = props;
  const navigate = useNavigate();

  useKeyPress([num], () => navigate(to));

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

function Project(props) {
  const { project } = props;

  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <NavLink
      className={({ isActive }) => (isActive ? 'habit active' : 'habit')}
      to={`project/${linkify(project._id)}`}
      style={{
        backgroundColor: ({ isActive }) => (isActive ? `${project.color}33` : ''),
      }}
      title={project.name}
    >
      <HabitTag habit={project} />
    </NavLink>
  );
}
