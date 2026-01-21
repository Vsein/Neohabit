import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import useTitle from '../hooks/useTitle';
import useAnchor from '../hooks/useAnchor';
import {
  useGetSettingsQuery,
  useGetSelfQuery,
  useUpdateSettingsMutation,
} from '../state/services/settings';
import { changeTo } from '../state/features/overlay/overlaySlice';

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
        <Link className="settings-type" to="#profile">
          Profile
        </Link>
        <Link className="settings-type" to="#general">
          General
        </Link>
        <Link className="settings-type" to="#heatmaps">
          Heatmaps
        </Link>
        <Link className="settings-type" to="#habits">
          Habits
        </Link>
        <Link className="settings-type" to="#stopwatch">
          Stopwatch
        </Link>
        <Link className="settings-type" to="#danger-zone">
          Danger
        </Link>
      </div>
      <div className="settings">
        <SettingsSection
          name="profile"
          elements={
            <>
              <div className="settings-option simple">
                <h3 className="settings-name">Username:</h3>
                <div className="settings-chooser">
                  <p>{self.data.username}</p>
                </div>
              </div>
              <div className="settings-option simple">
                <h3 className="settings-name">Email:</h3>
                <div className="settings-chooser">
                  <p>{self.data.email}</p>
                </div>
              </div>
              <div className="settings-option simple">
                <h3
                  className="settings-name ribbon ribbon-top"
                  style={{
                    opacity: 0.5,
                    position: 'relative',
                    width: 'min-content',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ borderRadius: '10px 10px 0px 0px' }}>soon</span>
                  Change password
                </h3>
              </div>
            </>
          }
        />
        <SettingsSection
          name="general"
          elements={
            <>
              <SettingsButtonOption
                name="Preferred theme"
                cssName="theme"
                curState={settings.data.theme}
                update={(state) => updateSettings({ values: { theme: state } })}
                choices={[
                  { name: 'Dark', state: 'dark' },
                  { name: 'Light', state: 'light' },
                ]}
              />
              <SettingsButtonOption
                name="Hide hints on cells"
                cssName="cell_hints"
                curState={settings.data.hide_cell_hint}
                update={(state) => updateSettings({ values: { hide_cell_hint: state } })}
                choices={[
                  { name: 'On', state: true },
                  { name: 'Off', state: false },
                ]}
              />
            </>
          }
        />
        <SettingsSection
          name="heatmaps"
          elements={
            <>
              {/* <SettingsNumberOption */}
              {/*   name="Heatmap height" */}
              {/*   curState={settings.data.cell_height_multiplier} */}
              {/*   update={(state) => updateSettings({ values: { cell_height_multiplier: +state } })} */}
              {/*   min="1" */}
              {/*   max="4" */}
              {/* /> */}
              <SettingsButtonOption
                name="Behavior when whole period doesn't fit"
                curState={settings.data.allow_horizontal_scrolling ?? true}
                update={(state) =>
                  updateSettings({ values: { allow_horizontal_scrolling: state } })
                }
                choices={[
                  { name: 'Adaptive', state: true },
                  { name: 'Rigid', state: false },
                ]}
              />
              {settings.data.allow_horizontal_scrolling ? (
                <SettingsButtonOption
                  name="Limit the adaptive period duration?"
                  curState={settings.data.overview_apply_limit ?? true}
                  update={(state) => updateSettings({ values: { overview_apply_limit: state } })}
                  choices={[
                    { name: 'On', state: true },
                    { name: 'Off', state: false },
                  ]}
                />
              ) : (
                <SettingsNumberOption
                  name="Heatmap period duration"
                  curState={settings.data?.overview_duration ?? 32}
                  update={(state) => updateSettings({ values: { overview_duration: +state } })}
                  min="1"
                  max="365"
                />
              )}
              {settings.data.allow_horizontal_scrolling && settings.data?.overview_apply_limit && (
                <SettingsNumberOption
                  name="Period duration limit"
                  curState={settings.data?.overview_duration_limit ?? 32}
                  update={(state) =>
                    updateSettings({ values: { overview_duration_limit: +state } })
                  }
                  min="1"
                  max="365"
                />
              )}
              <SettingsNumberOption
                name="Offset from the period start/period end"
                curState={settings.data?.overview_offset ?? 0}
                update={(state) => updateSettings({ values: { overview_offset: +state } })}
                min="-365"
                max="365"
              />
              <SettingsButtonOption
                name="Use current day as period's..."
                cssName="first-day"
                curState={settings.data.overview_current_day ?? 'middle'}
                update={(state) => updateSettings({ values: { overview_current_day: state } })}
                choices={[
                  { name: 'End', state: 'end' },
                  { name: 'Middle', state: 'middle' },
                  { name: 'Start', state: 'start' },
                ]}
              />
            </>
          }
        />
        <SettingsSection
          name="habits"
          elements={
            <>
              <SettingsButtonOption
                name="Use a different period start for heatmaps"
                curState={settings.data.habit_heatmaps_override ?? false}
                update={(state) => updateSettings({ values: { habit_heatmaps_override: state } })}
                choices={[
                  { name: 'On', state: true },
                  { name: 'Off', state: false },
                ]}
              />
              <SettingsButtonOption
                name="Use current day as period's..."
                cssName="first-day"
                disabled={!settings.data.habit_heatmaps_override}
                curState={settings.data.habit_heatmaps_current_day ?? 'middle'}
                update={(state) =>
                  updateSettings({ values: { habit_heatmaps_current_day: state } })
                }
                choices={[
                  { name: 'End', state: 'end' },
                  { name: 'Middle', state: 'middle' },
                  { name: 'Start', state: 'start' },
                ]}
              />
            </>
          }
        />
        <SettingsSection
          name="stopwatch"
          elements={
            <>
              <SettingsButtonOption
                name="Show stopwatch time in the page title"
                cssName="orientation"
                curState={settings.data.show_stopwatch_time_in_page_title ?? true}
                update={(state) =>
                  updateSettings({ values: { show_stopwatch_time_in_page_title: state } })
                }
                choices={[
                  { name: 'On', state: true },
                  { name: 'Off', state: false },
                ]}
              />
            </>
          }
        />
        {/* <SettingsSection */}
        {/*   name="overview" */}
        {/*   elements={ */}
        {/*     <> */}
        {/*       <SettingsButtonOption */}
        {/*         name="Preferred overview orientation" */}
        {/*         cssName="orientation" */}
        {/*         curState={settings.data.overview_vertical} */}
        {/*         update={(state) => updateSettings({ values: { overview_vertical: state } })} */}
        {/*         choices={[ */}
        {/*           { name: 'Horizontal', state: false }, */}
        {/*           { name: 'Vertical', state: true }, */}
        {/*         ]} */}
        {/*       /> */}
        {/*     </> */}
        {/*   } */}
        {/* /> */}
        <SettingsSection
          name="Danger zone"
          id="danger-zone"
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

function SettingsSection({ name, id = '', elements }) {
  const [settingCollapsed, setSettingCollapsed] = useState(false);

  const toggleSettingCollapsed = () => {
    setSettingCollapsed(!settingCollapsed);
  };

  return (
    <div className="settings-section">
      <div id={id || name} className="settings-section-header">
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

function SettingsButtonOption({
  name,
  cssName,
  update,
  choices,
  curState = undefined,
  disabled = false,
}) {
  return (
    <div className={`settings-option ${cssName} ${disabled ? 'disabled' : ''}`}>
      <h3 className="settings-name">{name}</h3>
      <div className="settings-chooser">
        {choices.map((choice, index) => (
          <button
            key={index}
            className={`button-default muted stretch ${choice.state} ${
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
      <h3 className="settings-name">{name}</h3>
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
