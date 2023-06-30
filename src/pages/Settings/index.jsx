import React from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import useAnchor from '../../hooks/useAnchor';
import useThemeToggler from '../../hooks/useThemeToggler';

export default function Settings() {
  useTitle('Settings | Neohabit');
  useAnchor();
  const [theme, { changeTheme }] = useThemeToggler();

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
        <div className="settings-section">
          <h1 id="general">&gt; General</h1>
          <div className="settings-option">
            <div className="settings-name">
              <h3>Preferred theme</h3>
            </div>
            <div className="settings-chooser">
              <button
                className={`dashboard-btn settings-btn dark ${
                  theme === 'dark' ? 'active' : ''
                }`}
                onClick={() => changeTheme('dark')}
              >
                Dark
              </button>
              <button
                className={`dashboard-btn settings-btn light ${
                  theme === 'light' ? 'active' : ''
                }`}
                onClick={() => changeTheme('light')}
              >
                Light
              </button>
            </div>
          </div>
        </div>
        <div className="settings-section">
          <h1 id="heatmaps">&gt; Heatmaps</h1>
        </div>
        <div className="settings-section">
          <h1 id="account">&gt; Account</h1>
        </div>
      </div>
    </main>
  );
}
