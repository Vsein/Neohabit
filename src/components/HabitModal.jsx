import React from 'react';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiClose } from '@mdi/js';
import Field from './FieldWrapper';
import HabitTag from './HabitTag';
import { ModalButtons, ColorPicker } from './ModalComponents';
import {
  useGetHabitsQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
} from '../state/services/habit';
import { close } from '../state/features/overlay/overlaySlice';

export default function HabitModal({ habitID, projectID, closeOverlay }) {
  const dispatch = useDispatch();
  const { data: habits, isFetching, isLoading } = useGetHabitsQuery();
  const [createHabit] = useCreateHabitMutation();
  const [updateHabit] = useUpdateHabitMutation();

  if (isLoading) return <></>;

  const habit = habits.find((habito) => habito._id === habitID) ?? {
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

  if (!habit) return <div>Missing habit!</div>;

  return isLoading || isFetching ? (
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
            <button className="icon small" onClick={closeOverlay} type="button" title="Close [C]">
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
            <ColorPicker />
            <div className="form-task-description">
              <Field name="elimination" component="input" type="checkbox" className="checkbox" />
              <label>Use elimination</label>
            </div>
            <div className="form-task-description">
              <Field name="numeric" component="input" type="checkbox" className="checkbox" />
              <label>Use numeric</label>
            </div>
          </div>
          <ModalButtons disabled={submitting || pristine} isNew={!habitID} type="habit" />
        </form>
      )}
    />
  );
}
