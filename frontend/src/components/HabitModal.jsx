import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Form } from 'react-final-form';
import { isSameDay } from 'date-fns';
import { Icon } from '@mdi/react';
import { mdiClose, mdiDelete } from '@mdi/js';
import Field from './FieldWrapper';
import { HabitTag } from './UI';
import { HabitModalWrapper } from './Habit';
import { NameField, DescriptionField, ModalButtons, ColorPicker } from './ModalComponents';
import { useGetProjectsQuery } from '../state/services/project';
import {
  useGetHabitsQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
} from '../state/services/habit';
import { useDeleteHabitTargetMutation } from '../state/services/habitTarget';
import { useUpdateSettingsMutation, useGetSettingsQuery } from '../state/services/settings';
import { getNumericTextColor } from '../hooks/usePaletteGenerator';
import { formatDate } from '../utils/dates';

export default function HabitModal({ habitID, projectID, closeOverlay }) {
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const settings = useGetSettingsQuery();
  const [createHabit] = useCreateHabitMutation();
  const [updateHabit] = useUpdateHabitMutation();
  const [updateSettings] = useUpdateSettingsMutation();
  const [deleteHabitTarget] = useDeleteHabitTargetMutation();
  const [currentTab, setCurrentTab] = useState('general');

  if (habits.isLoading || projects.isLoading) return <></>;

  const project = projects.data.find((p) => p.id === projectID) ?? {
    name: 'Default',
    color: '#1D60C1',
    description: '',
    habits: [],
  };

  const habit = habits.data.find((h) => h.id === habitID) ?? {
    name: '',
    color: '#23BCDB',
    description: '',
  };

  const onSubmit = async (values) => {
    if (!habitID) {
      await createHabit({
        ...values,
        project_id: projectID !== 'default' && projectID ? projectID : undefined,
      });
      closeOverlay();
    } else {
      await updateHabit({ habitID, values });
    }
  };

  const getButtonStyle = (color) => {
    const numericTextColor = getNumericTextColor(color);
    return {
      '--signature-color': color,
      '--active-text-color': numericTextColor !== '#000000' ? '#ffffff' : '#000000',
    };
  };

  if (!habitID && !project) return <div>Missing habit!</div>;

  return habits.isFetching || projects.isFetching || settings.isFetching ? (
    <> </>
  ) : (
    <>
      <Form
        initialValues={{
          name: habit?.name,
          description: habit?.description,
          color: habit?.color,
          is_numeric: habit?.is_numeric,
          is_monochromatic: habit?.is_monochromatic,
          more_is_bad: habit?.more_is_bad,
        }}
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form
            onSubmit={async (e) => {
              await handleSubmit(e);
            }}
            className={`modal modal-active modal-habit ${!habitID ? 'new' : 'hasid'}`}
            onClick={(e) => {
              const cellAddDropdown = document.querySelector('.cell-add-dropdown');
              cellAddDropdown.classList.add('hidden');
            }}
          >
            <div className="modal-header">
              <div className="tag-wrapper">
                {projectID && (
                  <div className="tag-wrapper">
                    Project:
                    <NavLink
                      className="tag"
                      onClick={closeOverlay}
                      to={`../project/${project?.id}`}
                      title={project.name}
                    >
                      <HabitTag habit={project} />
                    </NavLink>
                    &gt;
                  </div>
                )}
                {habitID ? (
                  <div className="tag-wrapper">
                    Habit:
                    <NavLink
                      className="tag"
                      onClick={closeOverlay}
                      to={`../habit/${habit?.id}`}
                      title={habit.name}
                    >
                      <HabitTag habit={habit} />
                    </NavLink>
                  </div>
                ) : (
                  <div className="tag-wrapper">New habit</div>
                )}
              </div>
              <button
                className="icon small"
                onClick={closeOverlay}
                type="button"
                title="Close [esc / c]"
              >
                <Icon path={mdiClose} />
              </button>
            </div>
            {habitID && (
              <nav
                className="habit-navigation"
                style={getButtonStyle(
                  settings.data.modals_live_color_preview && values.color.length === 7
                    ? values.color
                    : habit.color,
                )}
              >
                <ul className="filters">
                  <li
                    className={`centering ${currentTab === 'general' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('general')}
                  >
                    General
                  </li>
                  <li
                    className={`centering ${currentTab === 'targets' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('targets')}
                  >
                    Targets
                  </li>
                </ul>
              </nav>
            )}
            {habitID && (
              <HabitModalWrapper
                habit={habit}
                currentTab={currentTab}
                overridenElimination={values.more_is_bad}
                overridenNumeric={values.is_numeric}
                overridenMonochromatic={values.is_monochromatic}
                overridenColor={
                  settings.data.modals_live_color_preview && values.color.length === 7
                    ? values.color
                    : undefined
                }
              />
            )}
            {currentTab === 'general' ? (
              <>
                <div className="modal-details-habit-wrapper">
                  <div className="modal-details-block name-area" style={{ height: 'min-content' }}>
                    <NameField type="habit" autofocus={!habitID} />
                  </div>
                  <div className="modal-details-block description-area">
                    <DescriptionField rows="12" />
                  </div>
                  <div className="modal-details-block mode-area">
                    <label
                      className="form-task-description"
                      title="Similar to github/anki style heatmaps"
                    >
                      <Field
                        name="is_monochromatic"
                        component="input"
                        type="checkbox"
                        className="checkbox"
                      />
                      Monochromatic
                    </label>
                    <label
                      className={`form-task-description ${values.is_monochromatic ? 'overriden' : ''}`}
                      title="Shows numbers inside of cells, or default to this if target > 16"
                    >
                      <Field
                        name="is_numeric"
                        component="input"
                        type="checkbox"
                        className="checkbox"
                      />
                      Show as numbers
                    </label>
                    <label
                      className={`form-task-description ${values.is_monochromatic ? 'overriden' : ''}`}
                      title="Darkens the cells if they exceed the target"
                    >
                      <Field
                        name="more_is_bad"
                        component="input"
                        type="checkbox"
                        className="checkbox"
                      />
                      More is bad
                    </label>
                  </div>
                  <div className="modal-details-block color-area centering habit-color-area">
                    {habitID && (
                      <label
                        className="form-task-description"
                        title="Dynamically show color changes"
                      >
                        <input
                          type="checkbox"
                          className="checkbox muted"
                          checked={settings.data.modals_live_color_preview}
                          onChange={() =>
                            updateSettings({
                              values: {
                                modals_live_color_preview: !settings.data.modals_live_color_preview,
                              },
                            })
                          }
                        />
                        Live color preview
                      </label>
                    )}
                    <ColorPicker />
                  </div>
                </div>
                <ModalButtons
                  disabled={submitting || pristine}
                  unnamed={!values?.name}
                  isNew={!habitID}
                  type="habit"
                  form={form}
                />
              </>
            ) : (
              <></>
            )}
            {currentTab === 'targets' ? (
              <div className="modal-details-habit-targets-wrapper">
                {habit.targets.length ? (
                  <>
                    <div className="modal-details-block header centering">
                      <div />
                      <div>Start date</div>
                      <div>Target</div>
                      <div>Period</div>
                    </div>
                    {habit.targets.map((target, i, ts) => {
                      const targetDateStart = new Date(target.date_start);
                      const overriden =
                        i < ts.length - 1 && isSameDay(ts[i + 1].date_start, targetDateStart);

                      return (
                        <div
                          key={i}
                          className={`modal-details-block centering target-${i} ${overriden ? 'inactive' : ''}`}
                          // TODO: this is a quickfix for .cell-period, need to refactor to pure css
                          onMouseEnter={() => {
                            if (target.period > 1) {
                              document
                                .querySelectorAll(`.modal-habit .target-${i}.cell-period`)
                                .forEach((el) => el.classList.add('hover'));
                            }
                          }}
                          onMouseLeave={() => {
                            if (target.period > 1) {
                              document
                                .querySelectorAll(`.modal-habit .target-${i}.cell-period.hover`)
                                .forEach((el) => el.classList.remove('hover'));
                            }
                          }}
                        >
                          <div>{`${i + 1}.`}</div>
                          <div>{formatDate(targetDateStart)}</div>
                          <div>{target.value}</div>
                          <p>
                            {target.period} day{target.period > 1 && 's'}{' '}
                          </p>
                          <p>{overriden ? 'overriden' : ''}</p>
                          <button
                            className="centering right"
                            onClick={() => deleteHabitTarget({ habitTargetID: target.id, habitID })}
                            title="Delete this target"
                            type="button"
                          >
                            <Icon path={mdiDelete} className="icon small" />
                          </button>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <h4
                    className="modal-details-block centering"
                    style={{ justifyContent: 'center', gridTemplateColumns: '1fr' }}
                  >
                    No targets &nbsp;&nbsp;ʕ•ᴥ•ʔ
                  </h4>
                )}
              </div>
            ) : (
              <></>
            )}
          </form>
        )}
      />
    </>
  );
}
