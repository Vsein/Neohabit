import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@mdi/react';
import {
  mdiFamilyTree,
  mdiTrendingUp,
  mdiCheckboxMultipleMarked,
  mdiCog,
  mdiViewDashboard,
} from '@mdi/js';

export default function SidebarMobile() {
  return (
    <aside className="sidebar-mobile">
      <ul className="filters-mobile">
        <SectionMobile path={mdiTrendingUp} title="Projects" to="/projects" />
        <SectionMobile path={mdiFamilyTree} title="Skills" to="/skills" />
        <SectionMobile path={mdiCheckboxMultipleMarked} title="To-do" to="/todo" />
        <SectionMobile path={mdiViewDashboard} title="Overview" to="/overview" />
        <SectionMobile path={mdiCog} title="Settings" to="/settings" />
      </ul>
      <ul className="habits-mobile"></ul>
    </aside>
  );
}

function SectionMobile({ to, path, title }) {
  return (
    <NavLink
      className={({ isActive }) => (isActive ? 'filter-mobile active' : 'filter-mobile')}
      to={to}
      tabIndex="0"
    >
      <Icon path={path} className="icon" />
      <p>{title}</p>
    </NavLink>
  );
}
