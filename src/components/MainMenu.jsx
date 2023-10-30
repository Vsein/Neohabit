import React from 'react';
import { NavLink } from 'react-router-dom';
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
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../state/services/settings';

export default function MainMenu(props) {
  const { toggleSidebar } = props;
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
  const settings = useGetSettingsQuery();

  if (settings.isLoading) {
    return <></>;
  }

  const theme = settings.data.prefer_dark ? 'dark' : 'light';

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
