import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import {
  mdiCog,
  mdiMenu,
  mdiLogoutVariant,
  mdiAccount,
  mdiBell,
  mdiMoonWaxingCrescent,
  mdiWhiteBalanceSunny,
} from '@mdi/js';
import PFP from './ProfilePicture';
import AccountInfo from './AccountInfo';
import useMenuToggler from '../hooks/useMenuToggler';
import { changeTo } from '../state/features/theme/themeSlice';

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
      <button className="logo-section">
        <Icon path={mdiBell} alt="bell" className="icon notifications" />
      </button>
      <button
        className={`logo-section right menu-toggle ${
          menuOpened ? 'active' : ''
        }`}
        onClick={toggleMenu}
      >
        <PFP type="tiny" />
      </button>
      <ul
        className={`menu-container ${menuOpened ? 'active' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <AccountInfo />
        <hr />
        <MenuSection path={mdiAccount} title="Profile" to="/profile" />
        <ThemeToggle />
        <MenuSection path={mdiCog} title="Settings" to="/settings" />
        <MenuSection path={mdiLogoutVariant} title="Log out" to="/logout" />
      </ul>
    </nav>
  );
}

function MenuSection(props) {
  const { path, to, title, status, raw } = props;
  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          isActive ? 'menu-section active' : 'menu-section'
        }
        tabIndex="0"
        to={to}
      >
        <Icon path={path} className="icon" />
        <p className="link">{title}</p>
      </NavLink>
    </li>
  );
}

function ThemeToggle() {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState('dark');
  const title = `Theme: ${theme}`;
  const changeTheme = () => {
    const root = document.documentElement;
    const newTheme = root.className === 'dark' ? 'light' : 'dark';
    dispatch(changeTo(newTheme));
    const link = document.querySelector("link[rel~='icon']");
    link.href = newTheme === 'dark' ? './logos/favicon-dark2.ico' : './logos/favicon.ico';
    root.className = newTheme;
    setTheme(newTheme);
  };

  return (
    <li>
      <a className="menu-section" onClick={changeTheme}>
        <Icon
          path={
            theme === 'dark'
              ? mdiMoonWaxingCrescent
              : mdiWhiteBalanceSunny
          }
          className="icon"
        />
        <p className="link">{title}</p>
      </a>
    </li>
  );
}
