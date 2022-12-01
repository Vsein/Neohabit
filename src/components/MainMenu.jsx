import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import {
  mdiCog,
  mdiMenu,
  mdiLogoutVariant,
  mdiAccount,
  mdiBell,
} from '@mdi/js';
import PFP from './ProfilePicture';
import AccountInfo from './AccountInfo';
import useMenuToggler from '../hooks/useMenuToggler';

export default function MainMenu(props) {
  const { toggleSidebar } = props;
  const [menuOpened, { toggleMenu }] = useMenuToggler();

  return (
    <nav className="menu">
      <button
        className="logo-section left sidebar-toggle-container"
        onClick={toggleSidebar}
      >
        <Icon path={mdiMenu} className="icon sidebar-toggle" />
      </button>
      <h2 className="logo neohabit"></h2>
        {/* <Icon path={mdiApps} className="icon" /> */}
      {/* </button> */}
      <button className='logo-section'>
        <Icon path={mdiBell} alt="bell" className="icon notifications"/>
      </button>
      <button
        className={`logo-section right menu-toggle ${menuOpened ? 'active' : ''}`}
        onClick={toggleMenu}
      >
        <PFP type='tiny'/>
      </button>
      <ul
        className={`menu-container ${menuOpened ? 'active' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <AccountInfo />
        <hr />
        <MenuSection
          path={mdiAccount}
          title="Profile"
          to="/profile"
        />
        <MenuSection
          path={mdiCog}
          title="Settings"
          to="/settings"
        />
        <MenuSection
          path={mdiLogoutVariant}
          title="Log out"
          to="/logout"
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
      </NavLink>
    </li>
  );
}
