import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import {
  mdiHome,
  mdiFamilyTree,
  mdiTrendingUp,
  mdiCheckboxMultipleMarked,
  mdiPost,
  mdiCog,
} from '@mdi/js';

export default function Sidebar(props) {
  const { hidden } = props;

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
    </aside>
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
