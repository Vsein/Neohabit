import React from 'react';
import { Form, Field } from 'react-final-form';
import { useSelector, useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import ProjectTag from './ProjectTag';
import {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useCreateTaskMutation,
} from '../state/services/todolist';
import { useGetProjectsQuery } from '../state/services/project';
import { close } from '../state/features/taskOverlay/taskOverlaySlice';
// import bin from '../icons/trash-can-outline.svg';

export default function Overlay() {
  const dispatch = useDispatch();
  const { isActive } = useSelector((state) => ({
    isActive: state.taskOverlay.isActive,
  }));
  const { taskID } = useSelector((state) => ({
    taskID: state.taskOverlay.taskID,
  }));
  const task = useGetTasksQuery().data.find((task1) => task1._id == taskID);
  const { projectID } = useSelector((state) => ({
    projectID: state.taskOverlay.projectID,
  }));
  const { data: projects, isFetching, isLoading } = useGetProjectsQuery();
  const project =
    projects.find((projecto) => projecto._id == projectID) ??
    projects.find((projecto) => projecto.name == 'Default');
  const [updateTask] = useUpdateTaskMutation();
  const [createTask] = useCreateTaskMutation();

  const closeOverlay = (e) => {
    e.stopPropagation();
    dispatch(close());
  };

  const onSubmit = async (values) => {
    if (task) {
      await updateTask({ taskID, values });
    } else {
      await createTask(values);
    }
    dispatch(close());
  };

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (!project) {
    return (
      <div
        className={isActive ? 'overlay overlay-active' : 'overlay'}
        onClick={closeOverlay}
      >
        Missing project!
      </div>
    );
  };

  return (
    <div
      className={isActive ? 'overlay overlay-active' : 'overlay'}
      onClick={closeOverlay}
    >
      {isLoading || isFetching ? (
        <> </>
      ) : (
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
              onSubmit={async (e) => {
                await handleSubmit(e);
                form.reset();
              }}
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
                  onClick={closeOverlay}
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
      )}
    </div>
  );
}
