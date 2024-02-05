import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Icon } from '@mdi/react';
import {
  mdiCog,
  mdiMenu,
  mdiLogoutVariant,
  mdiAccount,
  mdiBell,
  mdiMoonWaxingCrescent,
  mdiWhiteBalanceSunny,
} from '@mdi/js';
import { AccountInfo, ProfilePicture } from './UI';
import useMenuToggler from '../hooks/useMenuToggler';
import { useUpdateSettingsMutation } from '../state/services/settings';

export default function MainMenu({ toggleSidebar }) {
  const [menuOpened, { toggleMenu }] = useMenuToggler();

  return (
    <nav className="menu">
      <button
        className="logo-section left sidebar-toggle-container"
        onClick={toggleSidebar}
        title="Toggle sidebar [s]"
      >
        <Icon path={mdiMenu} className="icon sidebar-toggle" />
      </button>
      <h2 className="logo neohabit"></h2>
      {/* <Icon path={mdiApps} className="icon" /> */}
      {/* </button> */}
      <button className="logo-section">
        <Icon path={mdiBell} alt="bell" className="icon right" />
      </button>
      <button
        className={`logo-section right menu-toggle ${menuOpened ? 'active' : ''}`}
        onClick={toggleMenu}
        title="Toggle menu [I]"
      >
        <ProfilePicture type="tiny" />
      </button>
      <ul
        className={`menu-container ${menuOpened ? 'active' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <AccountInfo />
        <hr />
        <li>
          <Link
            className="menu-section"
            tabIndex="0"
            to="/settings#profile"
          >
            <Icon path={mdiAccount} className="icon" />
            <p className="link">Profile</p>
          </Link>
        </li>
        <ThemeToggle />
        <MenuSection path={mdiCog} title="Settings" to="/settings" />
        <MenuSection path={mdiLogoutVariant} title="Log out" to="/logout" />
      </ul>
    </nav>
  );
}

function MenuSection({ path, to, title }) {
  return (
    <li>
      <NavLink
        className={({ isActive }) => (isActive ? 'menu-section active' : 'menu-section')}
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
  const [updateSettings] = useUpdateSettingsMutation();
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  return (
    <li>
      <a
        className="menu-section"
        onClick={() => updateSettings({ values: { prefer_dark: theme !== 'dark' } })}
      >
        <Icon
          path={theme === 'dark' ? mdiMoonWaxingCrescent : mdiWhiteBalanceSunny}
          className="icon"
        />
        <p className="link">{`Theme: ${theme}`}</p>
      </a>
    </li>
  );
}
