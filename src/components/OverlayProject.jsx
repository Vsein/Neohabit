import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { useSelector, useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import ProjectTag from './ProjectTag';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from '../state/services/project';
import { close } from '../state/features/projectOverlay/projectOverlaySlice';
// import bin from '../icons/trash-can-outline.svg';

export default function OverlayProject() {
  const dispatch = useDispatch();
  const { isActive } = useSelector((state) => ({
    isActive: state.projectOverlay.isActive,
  }));
  const { projectID } = useSelector((state) => ({
    projectID: state.projectOverlay.ID,
  }));
  const { data: projects, isFetching, isLoading } = useGetProjectsQuery();
  const project = projects.find((projecto) => projecto._id == projectID) ?? {
    name: '',
    color: '#aabbcc',
    description: '',
  };
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const closeOverlay = (e) => {
    e.stopPropagation();
    dispatch(close());
  };

  const onSubmit = async (values) => {
    if (project.name == '') {
      await createProject(values);
    } else {
      await updateProject({ projectID, values });
    }
    dispatch(close());
  };

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (!project) return <div>Missing project!</div>;

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
            name: project?.name,
            description: project?.description,
            color: project?.color,
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
                  <ProjectTag project={project} />
                </div>
                <button
                  className="close-modal-button icon"
                  onClick={closeOverlay}
                  type="button"
                >
                  <Icon path={mdiClose} />
                </button>
              </div>
              <div className="modal-details">
                <Field
                  name="name"
                  component="textarea"
                  placeholder="Change project name"
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
                    <div className="form-task-name">
                      <HexColorPicker
                        color={project?.color}
                        onChange={(coloro) => {
                          input.onChange(coloro);
                        }}
                      />
                      <HexColorInput
                        color={project?.color}
                        onChange={(coloro) => {
                          input.onChange(coloro);
                        }}
                        prefixed
                      />
                    </div>
                  )}
                </Field>
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
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
      )}
    </div>
  );
}
