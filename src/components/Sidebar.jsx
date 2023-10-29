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
import { changeTo } from '../state/features/overlay/overlaySlice';
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
    dispatch(changeTo({ projectID: '', habitID: '', type: 'project' }));
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
            raw="true"
            to="/dashboard"
            num="1"
          />
          <NavigationSection
            path={mdiFamilyTree}
            title={hidden ? 'Skills' : 'Skill trees'}
            status="raw"
            raw="true"
            to="/skills"
            num="2"
          />
          <NavigationSection
            path={mdiTrendingUp}
            title="Projects"
            status="raw"
            raw="true"
            to="/projects"
            num="3"
          />
          <NavigationSection path={mdiCheckboxMultipleMarked} title="To-do" to="/todo" num="4" />
          <NavigationSection path={mdiPost} title="Blog" status="soon" to="/blog" num="5" />
          <NavigationSection path={mdiCog} title="Settings" to="/settings" num="6" />
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
            <button className="centering right" onClick={openOverlay} title="Add project [A]">
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
                  <Project key={`project-${i}`} project={project} />
                ))}
                <Project project={defaultProject} />
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

function Project({ project }) {
  const habits = useGetHabitsQuery();
  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();
  const [habitsCollapsed, setHabitsCollapsed] = useState(true);

  const toggleHabitsCollapsed = () => {
    setHabitsCollapsed(!habitsCollapsed);
  };

  return (
    <ul className="sidebar-habits">
      <li className="sidebar-habits-header">
        <button className="centering" onClick={toggleHabitsCollapsed}>
          <Icon
            className={`icon small habit-circle sidebar-habits-arrow ${
              habitsCollapsed ? '' : 'active'
            }`}
            path={mdiChevronDown}
            style={{
              backgroundColor: project.color,
            }}
          />
        </button>
        <NavLink
          className={({ isActive }) => (isActive ? 'sidebar-project active' : 'sidebar-project')}
          to={`project/${linkify(project._id)}`}
          style={{
            backgroundColor: ({ isActive }) => (isActive ? `${project.color}33` : ''),
          }}
          title={project.name}
        >
          <p>{project.name}</p>
        </NavLink>
        {/* <button className="centering add" onClick={openOverlay} title="Add project [A]"> */}
        {/*   <Icon path={mdiPlus} className="icon" /> */}
        {/* </button> */}
      </li>
      <ul className={`sidebar-habits-container ${habitsCollapsed ? '' : 'active'}`}>
        {project.habits &&
          project.habits.map((habit, i) =>
            habit?._id ? (
              <NavLink
                key={i}
                className="habit"
                to={`habit/${linkify(habit._id)}`}
                style={{
                  backgroundColor: ({ isActive }) => (isActive ? `${project.color}33` : ''),
                }}
                title={habit.name}
              >
                <HabitTag key={i} habit={habit} />
              </NavLink>
            ) : (
              habits.data.find((habito) => habito._id === habit) && (
                <NavLink
                  key={i}
                  className="habit"
                  to={`habit/${linkify(habit)}`}
                  style={{
                    backgroundColor: ({ isActive }) => (isActive ? `${project.color}33` : ''),
                  }}
                >
                  <HabitTag key={i} habit={habits.data.find((habito) => habito._id === habit)} />
                </NavLink>
              )
            ),
          )}
      </ul>
    </ul>
  );
}
