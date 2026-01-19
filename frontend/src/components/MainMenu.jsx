import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook'
import { Icon } from '@mdi/react';
import {
  mdiCog,
  mdiMenu,
  mdiLogoutVariant,
  mdiAccount,
  mdiBell,
  mdiMoonWaxingCrescent,
  mdiWhiteBalanceSunny,
  mdiGithub,
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
      <Link
        tabIndex="0"
        to="/"
        target="_blank"
      >
        <h2 className="neohabit logo"></h2>
      </Link>
      {/* <Icon path={mdiApps} className="icon" /> */}
      {/* </button> */}
      {/* <button className="logo-section"> */}
      {/*   <Icon path={mdiBell} alt="bell" className="icon right" /> */}
      {/* </button> */}
      <button
        className={`logo-section right menu-toggle ${menuOpened ? 'active' : ''}`}
        onClick={toggleMenu}
        title="Toggle menu [i]"
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
        <GithubLink />
        <hr />
        <MenuSection path={mdiLogoutVariant} title="Log out" to="/logout" />
      </ul>
    </nav>
  );
}

function GithubLink() {
  return (
    <li>
      <Link
        className="menu-section"
        tabIndex="0"
        target="_blank"
        to="https://github.com/Vsein/Neohabit"
      >
        <Icon path={mdiGithub} className="icon" />
        <p className="link">Github</p>
      </Link>
    </li>
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

  const toggleTheme = () => updateSettings({ values: { prefer_dark: theme !== 'dark' } });
  useHotkeys('shift+t', toggleTheme);

  return (
    <li>
      <button
        className="menu-section"
        onClick={() => updateSettings({ values: { theme: theme === 'dark' ? 'light' : 'dark' } })}
      >
        <Icon
          path={theme === 'dark' ? mdiMoonWaxingCrescent : mdiWhiteBalanceSunny}
          className="icon"
        />
        <p className="link">{`Theme: ${theme}`}</p>
      </button>
    </li>
  );
}

export { MenuSection, GithubLink };
