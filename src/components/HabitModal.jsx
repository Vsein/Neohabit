import React from 'react';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiClose } from '@mdi/js';
import Field from './FieldWrapper';
import HabitTag from './HabitTag';
import { NameField, DescriptionField, ModalButtons, ColorPicker } from './ModalComponents';
import { useGetProjectsQuery } from '../state/services/project';
import {
  useGetHabitsQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
} from '../state/services/habit';
import { close } from '../state/features/overlay/overlaySlice';

export default function HabitModal({ habitID, projectID, closeOverlay }) {
  const dispatch = useDispatch();
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const [createHabit] = useCreateHabitMutation();
  const [updateHabit] = useUpdateHabitMutation();

  if (habits.isLoading || projects.isLoading) return <></>;

  const project = projects.data.find((projecto) => projecto._id === projectID) ?? {
    name: 'Default',
    color: '#aabbcc',
    description: '',
    habits: [],
  };

  const habit = habits.data.find((habito) => habito._id === habitID) ?? {
    name: '',
    color: '#aabbcc',
    description: '',
  };

  const onSubmit = async (values) => {
    if (habit.name === '') {
      await createHabit({ ...values, projectID });
    } else {
      await updateHabit({ habitID, values });
    }
    dispatch(close());
  };

  if (!habitID && !project) return <div>Missing habit!</div>;

  return habits.isFetching || projects.isFetching ? (
    <> </>
  ) : (
    <Form
      initialValues={{
        name: habit?.name,
        description: habit?.description,
        color: habit?.color,
        elimination: habit?.elimination,
        numeric: habit?.numeric,
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form
          onSubmit={async (e) => {
            await handleSubmit(e);
          }}
          className="modal modal-active"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="tag-wrapper">
              {projectID && (
                <div className="tag-wrapper">
                  Project:
                  <div className="tag">
                    <HabitTag habit={project} />
                  </div>
                  &gt;
                </div>
              )}
              {habitID ? (
                <div className="tag-wrapper">
                  Habit:
                  <div className="tag">
                    <HabitTag habit={habit} />
                  </div>
                </div>
              ) : (
                <div className="tag-wrapper">New habit</div>
              )}
            </div>
            <button className="icon small" onClick={closeOverlay} type="button" title="Close [C]">
              <Icon path={mdiClose} />
            </button>
          </div>
          <div className="modal-details">
            <NameField type="habit" />
            <ColorPicker />
            <div className="form-task-description">
              <Field name="elimination" component="input" type="checkbox" className="checkbox" />
              <label>Use elimination</label>
            </div>
            <div className="form-task-description">
              <Field name="numeric" component="input" type="checkbox" className="checkbox" />
              <label>Use numeric</label>
            </div>
            <DescriptionField rows="5" />
          </div>
          <ModalButtons disabled={submitting} isNew={!habitID} type="habit" />
        </form>
      )}
    />
  );
}
