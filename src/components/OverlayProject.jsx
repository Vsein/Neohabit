import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import ProjectTag from './ProjectTag';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
} from '../state/services/project';
// import bin from '../icons/trash-can-outline.svg';

export default function OverlayProject(props) {
  const { active, toggleActive } = props;
  const project = useGetProjectsQuery().data.find(
    (projecto) => projecto.name == 'Default',
  );
  const [createProject] = useCreateProjectMutation();
  const navigate = useNavigate();

  const close = (e) => {
    e.stopPropagation();
    toggleActive();
  };

  const onSubmit = async (values) => {
    await createProject(values);
    toggleActive();
  };

  return (
    <div
      className={active ? 'overlay overlay-active' : 'overlay'}
      onClick={close}
    >
      <Form
        initialValues={{
          name: '',
          color: '',
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
                {project ? 'Save' : 'Add project'}
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
}
