import React from 'react';
import { Form } from 'react-final-form';
import { Icon } from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { HabitTag } from './UI';
import { NameField, DescriptionField, ModalButtons } from './ModalComponents';
import {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useCreateTaskMutation,
} from '../state/services/todolist';
import { useGetHabitsQuery } from '../state/services/habit';

export default function TaskModal({ taskID, habitID, closeOverlay }) {
  const habits = useGetHabitsQuery();
  const tasks = useGetTasksQuery();
  const [updateTask] = useUpdateTaskMutation();
  const [createTask] = useCreateTaskMutation();

  if (habits.isLoading || tasks.isLoading) return <></>;

  const task = tasks.data.find((t) => t.id === taskID);

  const onSubmit = async (values) => {
    if (task) {
      await updateTask({ taskID, values });
    } else {
      await createTask(values);
      closeOverlay();
    }
  };

  const habit = habits.data.find((h) => h.id === habitID) ?? {
    name: 'Default',
    color: '#8a8a8a',
  };

  return (
    <Form
      initialValues={{
        is_completed: task?.is_completed ?? false,
        name: task?.name ?? '',
        description: task?.description ?? '',
        habitID: task?.habit_id ?? habit?.id,
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
            <div className="tag">
              <HabitTag habit={task?.habit || habit} />
            </div>
            <button className="icon small" onClick={closeOverlay}>
              <Icon path={mdiClose} />
            </button>
          </div>
          <div className="modal-details-block" style={{ height: 'min-content' }}>
            <NameField type="task" />
          </div>
          <div className="modal-details-block">
            <DescriptionField rows="9" />
          </div>
          <ModalButtons
            disabled={submitting || pristine}
            unnamed={!values?.name}
            isNew={!taskID}
            type="task"
            form={form}
          />
        </form>
      )}
    />
  );
}
