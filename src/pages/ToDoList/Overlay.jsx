import React from 'react';
import { Form, Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import ProjectTag from '../../components/ProjectTag';
import {
  useGetProjectsQuery,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useCreateTaskMutation,
} from '../../state/services/todolist';
// import bin from '../icons/trash-can-outline.svg';

export default function Overlay() {
  const { projectID, taskID } = useParams();
  const task = useGetTasksQuery().data.find((task1) => task1._id == taskID);
  const project =
    useGetProjectsQuery().data.find((projecto) => projecto._id == projectID) ??
    useGetProjectsQuery().data.find((projecto) => projecto.name == 'Default');
  const [updateTask, { isLoading }] = useUpdateTaskMutation()
  const [createTask] = useCreateTaskMutation()
  const navigate = useNavigate();

  const close = (e) => {
    e.stopPropagation();
    navigate('..');
  };

  const onSubmit = async (values) => {
    if (task) {
      await updateTask({ taskID, values });
    } else {
      await createTask(values);
    }
    navigate('..');
  };

  return (
    <div className="overlay overlay-active" onClick={close}>
      <Form
        initialValues={{
          completed: task?.completed ?? false,
          name: task?.name ?? '',
          description: task?.description ?? '',
          projectID: task?.project._id ?? project._id,
        }}
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form
            onSubmit={handleSubmit}
            className="modal modal-active"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="tag">
                <ProjectTag project={task ? task.project : project} />
              </div>
              <button className="close-modal-button icon" onClick={close}>
                <Icon path={mdiClose} />
              </button>
            </div>
            <div className="modal-details">
              <label htmlFor="task-name">
                <Field
                  name="name"
                  component="textarea"
                  placeholder="Change task name"
                  rows="1"
                  className="form-task-name"
                />
              </label>
              <label htmlFor="task-description">
                <Field
                  name="description"
                  component="textarea"
                  placeholder="Change description"
                  rows="1"
                  className="form-task-description"
                />
              </label>
            </div>
            <div className="modal-buttons">
              <button
                className="form-button"
                id="cancel-form-button"
                onClick={close}
              >
                Cancel
              </button>
              <button
                className="form-button"
                id="submit-form-button"
                type="submit"
                disabled={submitting || pristine}
              >
                {task ? 'Save' : 'Add task'}
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
}
