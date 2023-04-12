import React from 'react';
import { Form, Field } from 'react-final-form';
import { useSelector, useDispatch } from 'react-redux'
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import ProjectTag from './ProjectTag';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
} from '../state/services/project';
import { close } from '../state/features/overlay/overlaySlice';
// import bin from '../icons/trash-can-outline.svg';

export default function OverlayProject() {
  const projectID = useSelector((state) => state.overlay.ID);
  const dispatch = useDispatch();
  const project =
    useGetProjectsQuery().data.find((projecto) => projecto._id == projectID) ??
    useGetProjectsQuery().data.find((projecto) => projecto.name == 'Default');
  const [createProject] = useCreateProjectMutation();

  const closeOverlay = (e) => {
    e.stopPropagation();
    dispatch(close());
  };

  const onSubmit = async (values) => {
    if (project.name == 'Default') {
      await createProject(values);
    } else {
    }
    dispatch(close());
  };

  return project.isFetching ? (
    <> </>
  ) : (
    <div
      className={useSelector((state) => state.overlay.isActive) ? 'overlay overlay-active' : 'overlay'}
      onClick={closeOverlay}
    >
      <Form
        initialValues={{
          name: project?.name,
          color: project?.color,
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
                <ProjectTag project={project} />
              </div>
              <button className="close-modal-button icon" onClick={close}>
                <Icon path={mdiClose} />
              </button>
            </div>
            <div className="modal-details">
              <label htmlFor="project-name">
                <Field
                  name="name"
                  component="textarea"
                  placeholder="Change project name"
                  rows="1"
                  className="form-task-name"
                />
              </label>
              <label htmlFor="task-color">
                <Field
                  name="color"
                  component="textarea"
                  placeholder="Change color"
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
                {project ? 'Save' : 'Add project'}
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
}
