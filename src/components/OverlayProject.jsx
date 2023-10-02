import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { useSelector, useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import HabitTag from './HabitTag';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from '../state/services/project';
import { useGetHabitsQuery } from '../state/services/habit';
import { close } from '../state/features/projectOverlay/projectOverlaySlice';
import useKeyPress from '../hooks/useKeyPress';

export default function OverlayProject() {
  const dispatch = useDispatch();
  const { isActive, projectID } = useSelector((state) => state.projectOverlay);
  const { data: projects, isFetching, isLoading } = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const project = projects.find((projecto) => projecto._id == projectID) ?? {
    name: '',
    color: '#aabbcc',
    description: '',
    habits: [],
  };
  const [projectHabitList, setProjectHabitList] = useState(project.habits);
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  useEffect(() => {
    setProjectHabitList(project.habits);
  }, [projectID, isActive]);

  const closeOverlay = (e) => {
    e.stopPropagation();
    dispatch(close());
  };

  useKeyPress(['c'], closeOverlay);

  const onSubmit = async (values) => {
    if (project.name == '') {
      await createProject({ ...values, habits: projectHabitList });
    } else {
      await updateProject({ projectID, values: { ...values, habits: projectHabitList } });
    }
    setProjectHabitList([]);
    dispatch(close());
  };

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (!project) return <div>Missing project!</div>;

  const isOneOfHabits = (habitID) => {
    const res = projectHabitList.find((projectHabitID) => projectHabitID === habitID);
    if (res === undefined) return false;
    return res !== -1;
  };

  return (
    <div className={isActive ? 'overlay overlay-active' : 'overlay'} onMouseDown={closeOverlay}>
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
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="tag">
                  <HabitTag habit={project} />
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
                <div className="form-split">
                  <div className="form-habits">
                    {habits.data.map((habit, i) => (
                      <div
                        className={`form-chooser ${isOneOfHabits(habit._id) ? 'active' : ''}`}
                        key={i}
                        onClick={() => {
                          if (!isOneOfHabits(habit._id)) {
                            setProjectHabitList([...projectHabitList, habit._id]);
                          } else {
                            setProjectHabitList(
                              projectHabitList.filter((habitID) => habitID !== habit._id),
                            );
                          }
                        }}
                      >
                        <HabitTag habit={habit} />
                      </div>
                    ))}
                  </div>
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
                  disabled={submitting}
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
