import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import useTitle from '../../hooks/useTitle';
import useAnchor from '../../hooks/useAnchor';
import { useGetSettingsQuery, useChangeThemeMutation } from '../../state/services/settings';

export default function Settings() {
  useTitle('Settings | Neohabit');
  useAnchor();

  return (
    <main className="settings-container">
      <div className="settings-bar">
        <Link className="settings-type" to="#general">
          General
        </Link>
        <Link className="settings-type" to="#heatmaps">
          Heatmaps
        </Link>
        <Link className="settings-type" to="#account">
          Account
        </Link>
      </div>
      <div className="settings">
        <SettingsSection name="general" elements={<ThemeOption />} />
        <SettingsSection name="heatmaps" />
        <SettingsSection name="account" />
      </div>
    </main>
  );
}

function SettingsSection({ name, elements }) {
  const [settingCollapsed, setSettingCollapsed] = useState(false);

  const toggleSettingCollapsed = () => {
    setSettingCollapsed(!settingCollapsed);
  };

  return (
    <div className="settings-section">
      <div id={name} className="settings-section-header">
        <button className="centering" onClick={toggleSettingCollapsed}>
          <Icon
            className={`icon big settings-section-arrow ${
              settingCollapsed ? '' : 'active'
            }`}
            path={mdiChevronDown}
          />
        </button>
        <h1>{name}</h1>
      </div>
      <div
        className={`settings-section-container ${
          settingCollapsed ? '' : 'active'
        }`}
      >
        {elements}
      </div>
    </div>
  );
}

function ThemeOption() {
  const [changeTheme] = useChangeThemeMutation();
  const settings = useGetSettingsQuery();
  const theme = settings.data.prefer_dark ? 'dark' : 'light';

  return (
    <div className="settings-option">
      <div className="settings-name">
        <h3>Preferred theme</h3>
      </div>
      <div className="settings-chooser">
        <button
          className={`dashboard-btn settings-btn dark ${
            theme === 'dark' ? 'active' : ''
          }`}
          onClick={() => changeTheme(true)}
        >
          Dark
        </button>
        <button
          className={`dashboard-btn settings-btn light ${
            theme === 'light' ? 'active' : ''
          }`}
          onClick={() => changeTheme(false)}
        >
          Light
        </button>
      </div>
    </div>
  );
}
