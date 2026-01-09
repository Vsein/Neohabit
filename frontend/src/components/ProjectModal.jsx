import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiClose, mdiPlus } from '@mdi/js';
import { HabitTag, HabitTagToDelete } from './UI';
import { NameField, DescriptionField, ModalButtons, ColorPicker } from './ModalComponents';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from '../state/services/project';
import { useGetHabitsQuery } from '../state/services/habit';
import { close } from '../state/features/overlay/overlaySlice';
import useMenuToggler from '../hooks/useMenuToggler';
import useLoaded from '../hooks/useLoaded';

export default function ProjectModal({ projectID, isActive, closeOverlay }) {
  const [loaded] = useLoaded();
  const [menuOpened, { toggleMenu }] = useMenuToggler();
  const dispatch = useDispatch();
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const [projectHabitList, setProjectHabitList] = useState([]);

  useEffect(() => {
    if (!projects.isLoading) {
      const project = projects.data.find((p) => p.id === projectID) ?? {
        name: '',
        color: '#1D60C1',
        description: '',
        habits: [],
      };
      setProjectHabitList(project.habits);
    }
  }, [projectID, isActive]);

  if (habits.isLoading || projects.isLoading) return <></>;

  const project = projects.data.find((p) => p.id === projectID) ?? {
    name: '',
    color: '#1D60C1',
    description: '',
    habits: [],
  };

  const onSubmit = async (values) => {
    if (!projectID) {
      await createProject({ ...values, habit_ids: projectHabitList });
    } else {
      await updateProject({ projectID, values: { ...values, habit_ids: projectHabitList } });
    }
    setProjectHabitList([]);
    dispatch(close());
  };

  if (!project) return <div>Missing project!</div>;

  const belongsToThisProject = (habitID) => {
    const res = projectHabitList.find((projectHabitID) => projectHabitID === habitID);
    if (res === undefined) return false;
    return res !== -1;
  };

  return (
    loaded && (
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
            }}
            className="modal modal-active"
            onClick={(e) => {
              if (menuOpened) toggleMenu();
              e.stopPropagation();
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              {projectID ? (
                <div className="tag-wrapper">
                  Project:
                  <NavLink
                    className="tag"
                    onClick={closeOverlay}
                    to={`../project/${project?.id}`}
                    title={project.name}
                  >
                    <HabitTag habit={project} />
                  </NavLink>
                </div>
              ) : (
                <div className="tag-wrapper" style={{ height: '100%' }}>
                  New project
                </div>
              )}
              <button className="icon small" onClick={closeOverlay} type="button" title="Close [C]">
                <Icon path={mdiClose} />
              </button>
            </div>
            <div className="modal-details-block" style={{ height: 'min-content' }}>
              <NameField type="project" />
            </div>
            <div className="modal-header habit-mode">
              <p>Habits:</p>
              <div
                className={`form-chooser add form-habits-toggle ${menuOpened ? 'active' : ''}`}
                onClick={toggleMenu}
                type="button"
                title="Close [C]"
              >
                <Icon className="icon small" path={mdiPlus} />
                <p>Add existing habits</p>
              </div>
              <ul
                className={`form-habits-container ${menuOpened ? 'active' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                {habits.data.map(
                  (habit, i) =>
                    !belongsToThisProject(habit.id) && (
                      <div
                        className="form-chooser"
                        key={i}
                        onClick={() => {
                          if (!belongsToThisProject(habit.id)) {
                            setProjectHabitList([...projectHabitList, habit.id]);
                          }
                        }}
                      >
                        <HabitTag habit={habit} />
                      </div>
                    ),
                )}
              </ul>
            </div>
            {!!projectHabitList?.length && (
              <div
                className="modal-details-block"
                style={{
                  height: 'auto',
                  maxHeight: '200px',
                  overflowY: 'scroll',
                  backgroundColor: 'var(--support-background-color)',
                  marginTop: '-10px',
                }}
              >
                <div className="form-habits">
                  {projectHabitList.map((habitID, i) => {
                    const habit = habits.data.find((h) => h.id === habitID);
                    return (
                      <div
                        className="form-chooser"
                        key={i}
                        onClick={() => {
                          if (!habit || !belongsToThisProject(habit?.id)) {
                            setProjectHabitList([...projectHabitList, habit.id]);
                          } else {
                            setProjectHabitList(
                              projectHabitList.filter((id) => id !== habit.id),
                            );
                          }
                        }}
                      >
                        <HabitTagToDelete habit={habit} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="modal-details-project-wrapper">
              <div className="modal-details-block description-area">
                <DescriptionField rows="9" />
              </div>
              <div className="modal-details-block color-area">
                <ColorPicker />
              </div>
            </div>
            <ModalButtons
              disabled={submitting}
              unnamed={!values?.name}
              isNew={!projectID}
              type="project"
            />
          </form>
        )}
      />
    )
  );
}
