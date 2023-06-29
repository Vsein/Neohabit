import React from 'react';
import { Link } from 'react-router-dom'
import useTitle from '../../hooks/useTitle';
import useAnchor from '../../hooks/useAnchor';

export default function Settings() {
  useTitle('Settings | Neohabit');
  useAnchor();

  return (
    <main className="settings-container">
      <div className="settings-bar">
        <Link className="settings-option" to="#general">
          General
        </Link>
        <Link className="settings-option" to="#heatmaps">
          Heatmaps
        </Link>
        <Link className="settings-option" to="#account">
          Account
        </Link>
      </div>
      <div className="settings">
        <div className="settings-section">
          <h1 id="general">
            &gt; General
          </h1>
        </div>
        <div className="settings-section">
          <h1 id="heatmaps">
            &gt; Heatmaps
          </h1>
        </div>
        <div className="settings-section">
          <h1 id="account">
            &gt; Account
          </h1>
        </div>
      </div>
    </main>
  );
}
