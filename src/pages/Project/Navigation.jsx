import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import ProjectTag from '../../components/ProjectTag';

export default function Navigation(props) {
  return (
    <nav className="tasklists-navigation">
      <ul className="filters">
        <Section name="Overview" to="overview" />
        <Section name="Heatmap" to="heatmap" />
        <Section name="Skill Tree" to="skill-tree" />
        <Section name="To Do" to="to-do" />
        <Section name="Notes" to="notes" />
      </ul>
    </nav>
  );
}

function Section(props) {
  const { name, to } = props;

  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <li>
      <NavLink className={({ isActive }) => (isActive ? 'filter active' : 'filter')} to={to}>
        {/* <Icon path={filter.image} height="20px" width="20px" /> */}
        <p>{name}</p>
      </NavLink>
    </li>
  );
}
