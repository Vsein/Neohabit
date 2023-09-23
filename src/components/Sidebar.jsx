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
import { useGetFiltersQuery } from '../state/services/todolist';
import { useGetHabitsQuery } from '../state/services/habit';
import HabitTag from './HabitTag';
import { changeTo, open } from '../state/features/habitOverlay/habitOverlaySlice';
import useKeyPress from '../hooks/useKeyPress';

export default function Sidebar(props) {
  const habits = useGetHabitsQuery();
  const filters = useGetFiltersQuery();
  const dispatch = useDispatch();
  const { hidden } = props;
  const [habitsCollapsed, setHabitsCollapsed] = useState(false);

  const toggleHabitsCollapsed = () => {
    setHabitsCollapsed(!habitsCollapsed);
  };

  const openOverlay = () => {
    dispatch(open());
    dispatch(changeTo({ habitID: '', projectID: '' }));
  };

  useKeyPress(['a'], openOverlay);

  return (
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
          <button className="centering" onClick={toggleHabitsCollapsed}>
            <Icon
              className={`icon habits-arrow ${habitsCollapsed ? '' : 'active'}`}
              path={mdiChevronDown}
            />
          </button>
          <p>Habits</p>
          <button className="centering add" onClick={openOverlay} title="Add habit [A]">
            <Icon path={mdiPlus} className="icon" />
          </button>
        </li>
        <ul className={`habits-container ${habitsCollapsed ? '' : 'active'}`}>
          {habits.isFetching ? (
            <div className="habits-loader">
              <div className="loader" />
            </div>
          ) : (
            habits.data.map((habit, i) => (
              <li key={`habit-${i}`}>
                <Habit habit={habit} />
              </li>
            ))
          )}
        </ul>
      </ul>
    </aside>
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

function Habit(props) {
  const { habit } = props;

  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <NavLink
      className={({ isActive }) => (isActive ? 'habit active' : 'habit')}
      to={`habit/${linkify(habit._id)}`}
      style={{
        backgroundColor: ({ isActive }) => (isActive ? `${habit.color}33` : ''),
      }}
      title={habit.name}
    >
      <HabitTag habit={habit} />
    </NavLink>
  );
}
