import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
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

export default function MainMenu(props) {
  const { toggleSidebar } = props;
  const [menuOpened, setMenuOpened] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpened(!menuOpened);
  };

  useEffect(() => {
    document.addEventListener('click', () => setMenuOpened(false));
  });

  return (
    <nav className="menu">
      <button
        className="logo-section sidebar-toggle-container"
        onClick={toggleSidebar}
      >
        <Icon path={mdiMenu} className="icon sidebar-toggle" />
      </button>
      <h2 className="logo neohabit"></h2>
      <button
        className={`logo-section menu-toggle ${menuOpened ? 'active' : ''}`}
        onClick={toggleMenu}
      >
        <Icon path={mdiApps} className="icon" />
      </button>
      <ul
        className={`menu-container ${menuOpened ? 'active' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuSection
          path={mdiHome}
          title="Dashboard"
          status="raw"
          to="/dashboard"
          raw="true"
        />
        <MenuSection
          path={mdiFamilyTree}
          title="Skill trees"
          status="Coming soon"
          to="/skill-trees"
        />
        <MenuSection
          path={mdiTrendingUp}
          title="Habits"
          status="raw"
          to="/habits"
          raw="true"
        />
        <MenuSection
          path={mdiCheckboxMultipleMarked}
          title="To-do"
          to="/todo"
        />
        <MenuSection
          path={mdiPost}
          title="Blog"
          status="Coming soon"
          to="/blog"
        />
        <MenuSection
          path={mdiCog}
          title="Settings"
          status="Coming soon"
          to="/settings"
        />
      </ul>
    </nav>
  );
}

function MenuSection(props) {
  const { path, to, title, status, raw } = props;
  return (
    <li>
      <NavLink
        className={({ isActive }) => isActive ? 'menu-section active' : 'menu-section' }
        tabIndex="0"
        to={to}
      >
        <Icon path={path} className="icon" />
        <p className="link">{title}</p>
        <div className={`ribbon ribbon-top-right ${raw ? 'ribbon-raw' : ''}`}>
          <span>{status}</span>
        </div>
      </NavLink>
    </li>
  );
}
