import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import useTitle from '../../hooks/useTitle';
import useAnchor from '../../hooks/useAnchor';
import {
  useGetSettingsQuery,
  useGetSelfQuery,
  useUpdateSettingsMutation,
} from '../../state/services/settings';
import { changeTo } from '../../state/features/overlay/overlaySlice';

export default function Settings() {
  useTitle('Settings | Neohabit');
  useAnchor();
  const [updateSettings] = useUpdateSettingsMutation();
  const settings = useGetSettingsQuery();
  const self = useGetSelfQuery();

  const dispatch = useDispatch();
  const openAccountDeletionOverlay = () => {
    dispatch(changeTo({ type: 'deleteAccount' }));
  };

  return (
    <div className="page-settings">
      <div className="settings-bar">
        <Link className="settings-type right" to="#profile">
          Profile
        </Link>
        <Link className="settings-type" to="#general">
          General
        </Link>
        <Link className="settings-type" to="#overview">
          Overview
        </Link>
        <Link className="settings-type" to="#heatmaps">
          Heatmaps
        </Link>
        <Link className="settings-type left" to="#danger-zone">
          Danger
        </Link>
      </div>
      <div className="settings">
        <SettingsSection
          name="profile"
          elements={
            <>
              <div className="settings-option">
                <div className="settings-name">
                  <h3>Username:</h3>
                </div>
                <div className="settings-chooser">
                  <p>{self.data.username}</p>
                </div>
              </div>
              <div className="settings-option">
                <div className="settings-name">
                  <h3>Email:</h3>
                </div>
                <div className="settings-chooser">
                  <p>{self.data.email}</p>
                </div>
              </div>
              <div className="settings-option">
                <div className="settings-name">
                  <h3>Change password</h3>
                </div>
              </div>
            </>
          }
        />
        <SettingsSection
          name="general"
          elements={
            <SettingsButtonOption
              name="Preferred theme"
              cssName="theme"
              curState={settings.data.prefer_dark}
              update={(state) => updateSettings({ values: { prefer_dark: state } })}
              choices={[
                { name: 'Dark', state: true },
                { name: 'Light', state: false },
              ]}
            />
          }
        />
        <SettingsSection
          name="overview"
          elements={
            <>
              <SettingsButtonOption
                name="Preferred overview orientation"
                cssName="orientation"
                curState={settings.data.overview_vertical}
                update={(state) => updateSettings({ values: { overview_vertical: state } })}
                choices={[
                  { name: 'Horizontal', state: false },
                  { name: 'Vertical', state: true },
                ]}
              />
              <SettingsButtonOption
                name="Use current day as..."
                cssName="first-day"
                curState={settings.data.overview_current_day}
                update={(state) => updateSettings({ values: { overview_current_day: state } })}
                choices={[
                  { name: 'Period start', state: 'start' },
                  { name: 'Period middle', state: 'middle' },
                  { name: 'Period end', state: 'end' },
                ]}
              />
              <SettingsNumberOption
                name="Offset from the period start/period end"
                curState={settings.data?.overview_offset ?? 0}
                update={(state) => updateSettings({ values: { overview_offset: +state } })}
                min="-365"
                max="365"
              />
              <SettingsNumberOption
                name="Default overview period duration"
                curState={settings.data?.overview_duration ?? 32}
                update={(state) => updateSettings({ values: { overview_duration: +state } })}
                min="1"
                max="365"
              />
            </>
          }
        />
        <SettingsSection
          name="heatmaps"
          elements={
            <SettingsNumberOption
              name="Heatmap height"
              curState={settings.data.cell_height_multiplier}
              update={(state) => updateSettings({ values: { cell_height_multiplier: +state } })}
              min="1"
              max="4"
            />
          }
        />
        <SettingsSection
          name="Danger zone"
          elements={
            <SettingsButtonOption
              name="Delete account"
              cssName="delete-account"
              update={openAccountDeletionOverlay}
              choices={[{ name: 'Delete', state: false }]}
            />
          }
        />
      </div>
    </div>
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

function SettingsButtonOption({ name, cssName, update, choices, curState = undefined }) {
  return (
    <div className={`settings-option ${cssName}`}>
      <div className="settings-name">
        <h3>{name}</h3>
      </div>
      <div className="settings-chooser">
        {choices.map((choice, index) => (
          <button
            key={index}
            className={`button-default calm stretch ${choice.state} ${
              choice.state === curState ? 'active' : ''
            }`}
            onClick={() => update(choice.state)}
          >
            {choice.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsNumberOption({ name, curState, update, min, max }) {
  const [inputState, setInputState] = useState(curState);

  return (
    <div className="settings-option">
      <div className="settings-name">
        <h3>{name}</h3>
      </div>
      <div className="settings-chooser">
        <input
          className="button-default button-default-input muted stretch"
          type="number"
          min={min}
          max={max}
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
        />
        <button className="button-default muted" onClick={() => update(inputState)}>
          Save
        </button>
      </div>
    </div>
  );
}
