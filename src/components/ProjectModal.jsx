import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiClose, mdiPlus } from '@mdi/js';
import HabitTag, { HabitTagToDelete } from './HabitTag';
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
      const project = projects.data.find((projecto) => projecto._id === projectID) ?? {
        name: '',
        color: '#aabbcc',
        description: '',
        habits: [],
      };
      setProjectHabitList(project.habits);
    }
  }, [projectID, isActive]);

  if (habits.isLoading || projects.isLoading) return <></>;

  const project = projects.data.find((projecto) => projecto._id === projectID) ?? {
    name: '',
    color: '#aabbcc',
    description: '',
    habits: [],
  };

  const onSubmit = async (values) => {
    if (project.name == '') {
      await createProject({ ...values, habits: projectHabitList });
    } else {
      await updateProject({ projectID, values: { ...values, habits: projectHabitList } });
    }
    setProjectHabitList([]);
    dispatch(close());
  };

  if (!project) return <div>Missing project!</div>;

  const isOneOfHabits = (habitID) => {
    const res = projectHabitList.find((projectHabitID) => projectHabitID === habitID);
    if (res === undefined) return false;
    return res !== -1;
  };

  return loaded && (
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
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            {projectID ? (
              <div className="tag-wrapper">
                Project:
                <NavLink
                  className="tag"
                  onClick={closeOverlay}
                  to={`../project/${project?._id}`}
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
          <div className="modal-header habit-mode" style={{ marginBottom: '-10px' }}>
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
                  !isOneOfHabits(habit._id) && (
                    <div
                      className="form-chooser"
                      key={i}
                      onClick={() => {
                        if (!isOneOfHabits(habit._id)) {
                          setProjectHabitList([...projectHabitList, habit._id]);
                        }
                      }}
                    >
                      <HabitTag habit={habit} />
                    </div>
                  ),
              )}
            </ul>
          </div>
          <div
            className="modal-details-block"
            style={{
              height: 'auto',
              maxHeight: '200px',
              overflowY: 'scroll',
              backgroundColor: 'var(--support-background-color)',
            }}
          >
            <div className="form-habits">
              {projectHabitList.map((habitID, i) => {
                const habit = habits.data.find((habito) => habito._id === habitID);
                return (
                  <div
                    className="form-chooser"
                    key={i}
                    onClick={() => {
                      if (!isOneOfHabits(habit._id)) {
                        setProjectHabitList([...projectHabitList, habit._id]);
                      } else {
                        setProjectHabitList(
                          projectHabitList.filter((habitIDo) => habitIDo !== habit._id),
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
          <div className="modal-details-project-wrapper">
            <div className="modal-details-block description-area">
              <DescriptionField rows="9" />
            </div>
            <div className="modal-details-block color-area">
              <ColorPicker />
            </div>
          </div>
          <ModalButtons
            disabled={submitting || !values?.name}
            isNew={!projectID}
            type="project"
          />
        </form>
      )}
    />
  );
}
