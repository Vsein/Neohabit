import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Form } from 'react-final-form';
import { Icon } from '@mdi/react';
import { mdiClose, mdiPlus } from '@mdi/js';
import { HabitTag, HabitTagToDelete } from './UI';
import { NameField, DescriptionField, ModalButtons, ColorPicker } from './ModalComponents';
import { useCreateProjectMutation, useUpdateProjectMutation } from '../state/services/project';
import { useGetHabitsOutsideProjectsQuery } from '../state/services/habit';
import useMenuToggler from '../hooks/useMenuToggler';
import useLoaded from '../hooks/useLoaded';

export default function ProjectModal({ projectID, project, isActive, closeOverlay }) {
  const [loaded] = useLoaded();
  const [menuOpened, { toggleMenu }] = useMenuToggler();
  const habits = useGetHabitsOutsideProjectsQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const [projectHabitList, setProjectHabitList] = useState(project?.habits ?? []);
  const [unassignedHabitList, setUnassignedHabitList] = useState([]);

  useEffect(() => {
    if (!habits.isLoading) {
      setUnassignedHabitList(habits.data);
    }
  }, [projectID, isActive]);

  if (habits.isLoading) return <></>;

  const onSubmit = async (values) => {
    const habitIDs = projectHabitList.map((habit) => habit.id);
    if (!projectID) {
      await createProject({ ...values, habit_ids: habitIDs, habits: projectHabitList });
      closeOverlay();
    } else {
      await updateProject({
        projectID,
        values: { ...values, habit_ids: habitIDs, habits: projectHabitList },
      });
    }
    setProjectHabitList([]);
  };

  return (
    loaded && (
      <Form
        initialValues={{
          name: project?.name ?? '',
          description: project?.description ?? '',
          color: project?.color ?? '#1D60C1',
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
              <button
                className="icon small"
                onClick={closeOverlay}
                type="button"
                title="Close [esc / c]"
              >
                <Icon path={mdiClose} />
              </button>
            </div>
            <div className="modal-details-block" style={{ height: 'min-content' }}>
              <NameField type="project" autofocus={!projectID} />
            </div>
            <div className="modal-header habit-mode">
              <p>Habits:</p>
              <div
                className={`form-chooser add form-habits-toggle ${menuOpened ? 'active' : ''}`}
                onClick={toggleMenu}
                type="button"
                title="Close [esc / c]"
              >
                <Icon className="icon small" path={mdiPlus} />
                <p>Add existing habits</p>
              </div>
              <ul
                className={`form-habits-container ${menuOpened ? 'active' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                {unassignedHabitList.length ? (
                  unassignedHabitList.map((habit, i) => (
                    <div
                      className="form-chooser"
                      key={i}
                      onClick={() => {
                        setProjectHabitList([...projectHabitList, habit]);
                        setUnassignedHabitList(
                          unassignedHabitList.filter((h) => h.id !== habit.id),
                        );
                      }}
                    >
                      <HabitTag habit={habit} />
                    </div>
                  ))
                ) : (
                  <p>No unassigned habits</p>
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
                  {projectHabitList.map((habit, i) => (
                    <div
                      className="form-chooser"
                      key={i}
                      onClick={() => {
                        setUnassignedHabitList([...unassignedHabitList, habit]);
                        setProjectHabitList(projectHabitList.filter((h) => h.id !== habit.id));
                      }}
                    >
                      <HabitTagToDelete habit={habit} />
                    </div>
                  ))}
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
