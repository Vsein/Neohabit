import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { useSelector, useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import HabitTag from './HabitTag';
import {
  useGetHabitsQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
} from '../state/services/habit';
import { close } from '../state/features/habitOverlay/habitOverlaySlice';
import useKeyPress from '../hooks/useKeyPress';
// import bin from '../icons/trash-can-outline.svg';

export default function OverlayHabit() {
  const dispatch = useDispatch();
  const { isActive, habitID, projectID } = useSelector((state) => state.habitOverlay);
  const { data: habits, isFetching, isLoading } = useGetHabitsQuery();
  const habit = habits.find((habito) => habito._id == habitID) ?? {
    name: '',
    color: '#aabbcc',
    description: '',
  };
  const [createHabit] = useCreateHabitMutation();
  const [updateHabit] = useUpdateHabitMutation();

  const closeOverlay = (e) => {
    e.stopPropagation();
    dispatch(close());
  };

  useKeyPress(['c'], closeOverlay);

  const onSubmit = async (values) => {
    if (habit.name == '') {
      await createHabit({ ...values, projectID });
    } else {
      await updateHabit({ habitID, values });
    }
    dispatch(close());
  };

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (!habit) return <div>Missing habit!</div>;

  return (
    <div className={isActive ? 'overlay overlay-active' : 'overlay'} onMouseDown={closeOverlay}>
      {isLoading || isFetching ? (
        <> </>
      ) : (
        <Form
          initialValues={{
            name: habit?.name,
            description: habit?.description,
            color: habit?.color,
            elimination: habit?.elimination,
          }}
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form
              onSubmit={async (e) => {
                await handleSubmit(e);
                form.reset();
              }}
              className="modal modal-active"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="tag">
                  <HabitTag habit={habit} />
                </div>
                <button
                  className="close-modal-button icon"
                  onClick={closeOverlay}
                  type="button"
                  title="Close [C]"
                >
                  <Icon path={mdiClose} />
                </button>
              </div>
              <div className="modal-details">
                <Field
                  name="name"
                  component="textarea"
                  placeholder="Change habit name"
                  rows="1"
                  className="form-task-name"
                  required
                />
                <Field
                  name="description"
                  component="textarea"
                  placeholder="Change description"
                  rows="1"
                  className="form-task-description"
                />
                <Field name="color">
                  {({ input }) => (
                    <div className="form-task-name" style={{ color: input.value }}>
                      <HexColorPicker
                        color={input.value}
                        onChange={(coloro) => {
                          input.onChange(coloro);
                        }}
                      />
                      <HexColorInput
                        color={input.value}
                        onChange={(coloro) => {
                          input.onChange(coloro);
                        }}
                        prefixed
                      />
                    </div>
                  )}
                </Field>
                <div className="form-task-description">
                  <Field
                    name="elimination"
                    component="input"
                    type="checkbox"
                    className="checkbox"
                  />
                  <label>Use elimination</label>
                </div>
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="form-button"
                  id="cancel-form-button"
                  onClick={closeOverlay}
                  title="Cancel [C]"
                >
                  Cancel
                </button>
                <button
                  className="form-button"
                  id="submit-form-button"
                  type="submit"
                  disabled={submitting || pristine}
                >
                  {habit ? 'Save' : 'Add habit'}
                </button>
              </div>
            </form>
          )}
        />
      )}
    </div>
  );
}
