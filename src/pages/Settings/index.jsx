import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import useTitle from '../../hooks/useTitle';
import useAnchor from '../../hooks/useAnchor';
import {
  useGetSettingsQuery,
  useChangeThemeMutation,
  useChangeCellHeightMutation,
  useChangeOverviewOrientationMutation,
} from '../../state/services/settings';
import { open } from '../../state/features/deleteOverlay/deleteOverlaySlice';

export default function Settings() {
  useTitle('Settings | Neohabit');
  useAnchor();

  return (
    <main className="settings-container">
      <div className="settings-bar">
        <Link className="settings-type" to="#general">
          General
        </Link>
        <Link className="settings-type" to="#overview">
          Overview
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
        <SettingsSection name="overview" elements={<OverviewOrientationOption />} />
        <SettingsSection name="heatmaps" elements={<HeatmapHeightOption />} />
        <SettingsSection name="account" elements={<DeleteAccountOption />} />
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
            className={`icon big settings-section-arrow ${settingCollapsed ? '' : 'active'}`}
            path={mdiChevronDown}
          />
        </button>
        <h1>{name}</h1>
      </div>
      <div className={`settings-section-container ${settingCollapsed ? '' : 'active'}`}>
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
          className={`dashboard-btn settings-btn dark ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => changeTheme(true)}
        >
          Dark
        </button>
        <button
          className={`dashboard-btn settings-btn light ${theme === 'light' ? 'active' : ''}`}
          onClick={() => changeTheme(false)}
        >
          Light
        </button>
      </div>
    </div>
  );
}

function OverviewOrientationOption() {
  const [changeOverview] = useChangeOverviewOrientationMutation();
  const settings = useGetSettingsQuery();
  const state = settings.data.overview_vertical;

  return (
    <div className="settings-option">
      <div className="settings-name">
        <h3>Preferred overview orientation</h3>
      </div>
      <div className="settings-chooser">
        <button
          className={`dashboard-btn settings-btn ${state ? '' : 'active'}`}
          onClick={() => changeOverview(false)}
        >
          Horizontal
        </button>
        <button
          className={`dashboard-btn settings-btn ${state ? 'active' : ''}`}
          onClick={() => changeOverview(true)}
        >
          Vertical
        </button>
      </div>
    </div>
  );
}

function HeatmapHeightOption() {
  const [changeCellHeight] = useChangeCellHeightMutation();
  const settings = useGetSettingsQuery();
  const cellHeight = settings.data.cell_height_multiplier;
  const [cellHeightInput, setCellHeightInput] = useState(cellHeight);

  return (
    <div className="settings-option">
      <div className="settings-name">
        <h3>Heatmap Height</h3>
      </div>
      <div className="settings-chooser">
        <input
          className="settings-input settings-btn"
          type="number"
          min="1"
          max="4"
          value={cellHeightInput}
          onChange={(e) => setCellHeightInput(e.target.value)}
        />
        <button
          className="settings-input settings-save-btn dashboard-btn"
          onClick={() => changeCellHeight(cellHeightInput)}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function DeleteAccountOption() {
  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(open());
  };

  return (
    <div className="settings-option">
      <div className="settings-name">
        <h3>Delete account</h3>
      </div>
      <div className="settings-chooser">
        <button className="dashboard-btn settings-btn delete" onClick={openOverlay}>
          Delete
        </button>
      </div>
    </div>
  );
}
