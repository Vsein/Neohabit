import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import HabitTag from '../../components/HabitTag';

export default function Navigation(props) {
  const { filters, habits } = props;

  return (
    <nav className="tasklists-navigation">
      <ul className="filters">
        {filters.map((filter, i) => (
          <li key={`filter-${i}`}>
            <Filter filter={filter} />
          </li>
        ))}
      </ul>
      <ul className="habits">
        {habits.map((habit, i) => (
          <li key={`habit-${i}`}>
            <Habit habit={habit} />
          </li>
        ))}
      </ul>
    </nav>
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
    >
      <HabitTag habit={habit} />
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
