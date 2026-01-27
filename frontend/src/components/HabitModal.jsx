import React from 'react';
import { NavLink } from 'react-router-dom';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiClose } from '@mdi/js';
import Field from './FieldWrapper';
import { HabitTag } from './UI';
import { HabitModalWrapper } from './Habit';
import { NameField, DescriptionField, ModalButtons, ColorPicker } from './ModalComponents';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { useGetProjectsQuery } from '../state/services/project';
import {
  useGetHabitsQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
} from '../state/services/habit';
import { useUpdateSettingsMutation, useGetSettingsQuery } from '../state/services/settings';
import { close } from '../state/features/overlay/overlaySlice';

export default function HabitModal({ habitID, projectID, closeOverlay }) {
  const dispatch = useDispatch();
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const settings = useGetSettingsQuery();
  const [createHabit] = useCreateHabitMutation();
  const [updateHabit] = useUpdateHabitMutation();
  const [updateSettings] = useUpdateSettingsMutation();

  const { width } = useWindowDimensions();

  if (habits.isLoading || projects.isLoading) return <></>;

  const project = projects.data.find((p) => p.id === projectID) ?? {
    name: 'Default',
    color: '#23BCDB',
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
    } else {
      await updateHabit({ habitID, values });
    }
    dispatch(close());
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
            className="modal modal-active modal-habit"
            onClick={(e) => {
              const cellAddDropdown = document.querySelector('.cell-add-dropdown');
              cellAddDropdown.classList.add('hidden');
              e.stopPropagation();
            }}
            onMouseDown={(e) => e.stopPropagation()}
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
            <div className="modal-details-block" style={{ height: 'min-content' }}>
              <NameField type="habit" autofocus={!habitID} />
            </div>
            {width >= 850 && habitID && (
              <HabitModalWrapper
                habit={habit}
                overridenElimination={values.more_is_bad}
                overridenNumeric={values.is_numeric}
                overridenMonochromatic={values.is_monochromatic}
                overridenColor={
                  settings.data.modals_show_color_changes && values.color.length === 7
                    ? values.color
                    : undefined
                }
              />
            )}
            <div className="modal-details-habit-wrapper">
              <div className="modal-details-block description-area">
                <DescriptionField rows="10" />
              </div>
              <div className="modal-details-block mode-area">
                <div
                  className={`form-task-description ${values.is_monochromatic ? 'overriden' : ''}`}
                  title="Shows numbers inside of cells, or default to this if target > 16"
                >
                  <Field name="is_numeric" component="input" type="checkbox" className="checkbox" />
                  <label>Show as numbers</label>
                </div>
                <div
                  className="form-task-description"
                  title="Similar to github/anki style heatmaps"
                >
                  <Field
                    name="is_monochromatic"
                    component="input"
                    type="checkbox"
                    className="checkbox"
                  />
                  <label>Monochromatic</label>
                </div>
                <div
                  className={`form-task-description ${values.is_monochromatic ? 'overriden' : ''}`}
                  title="Darkens the cells if they exceed the target"
                >
                  <Field
                    name="more_is_bad"
                    component="input"
                    type="checkbox"
                    className="checkbox"
                  />
                  <label>More is bad</label>
                </div>
              </div>
              <div className="modal-details-block color-area centering">
                <div className="form-task-description" title="Dynamically show color changes">
                  <input
                    name="show_color_changes"
                    type="checkbox"
                    className="checkbox muted"
                    checked={settings.data.modals_show_color_changes}
                    onClick={() =>
                      updateSettings({
                        values: {
                          modals_show_color_changes: !settings.data.modals_show_color_changes,
                        },
                      })
                    }
                  />
                  <label>Dynamic colors</label>
                </div>
                <ColorPicker />
              </div>
            </div>
            <ModalButtons
              disabled={submitting || pristine}
              unnamed={!values?.name}
              isNew={!habitID}
              type="habit"
            />
          </form>
        )}
      />
    </>
  );
}
