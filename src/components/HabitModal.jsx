import React from 'react';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiClose } from '@mdi/js';
import Field from './FieldWrapper';
import HabitTag from './HabitTag';
import Habit from './Habit';
import { NameField, DescriptionField, ModalButtons, ColorPicker } from './ModalComponents';
import { useGetProjectsQuery } from '../state/services/project';
import {
  useGetHabitsQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
} from '../state/services/habit';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
import { close } from '../state/features/overlay/overlaySlice';

export default function HabitModal({ habitID, projectID, closeOverlay }) {
  const dispatch = useDispatch();
  const projects = useGetProjectsQuery();
  const habits = useGetHabitsQuery();
  const heatmaps = useGetHeatmapsQuery();
  const [createHabit] = useCreateHabitMutation();
  const [updateHabit] = useUpdateHabitMutation();

  if (habits.isLoading || projects.isLoading || heatmaps.isLoading) return <></>;

  const project = projects.data.find((projecto) => projecto._id === projectID) ?? {
    name: 'Default',
    color: '#aabbcc',
    description: '',
    habits: [],
  };

  const habit = habits.data.find((habito) => habito._id === habitID) ?? {
    name: '',
    color: '#aabbcc',
    description: '',
  };

  const heatmap = useGetHeatmapsQuery().data.find((heatmapo) => heatmapo.habit._id === habitID);

  const onSubmit = async (values) => {
    if (habit.name === '') {
      await createHabit({ ...values, projectID });
    } else {
      await updateHabit({ habitID, values });
    }
    dispatch(close());
  };

  if (!habitID && !project) return <div>Missing habit!</div>;

  return habits.isFetching || projects.isFetching ? (
    <> </>
  ) : (
    <>
      <Form
        initialValues={{
          name: habit?.name,
          description: habit?.description,
          color: habit?.color,
          elimination: habit?.elimination,
          numeric: habit?.numeric,
        }}
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form
            onSubmit={async (e) => {
              await handleSubmit(e);
            }}
            className="modal modal-active modal-habit"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ height: habitID ? '680px' : 'auto' }}
          >
            <div className="modal-header">
              <div className="tag-wrapper">
                {projectID && (
                  <div className="tag-wrapper">
                    Project:
                    <div className="tag">
                      <HabitTag habit={project} />
                    </div>
                    &gt;
                  </div>
                )}
                {habitID ? (
                  <div className="tag-wrapper">
                    Habit:
                    <div className="tag">
                      <HabitTag habit={habit} />
                    </div>
                  </div>
                ) : (
                  <div className="tag-wrapper">New habit</div>
                )}
              </div>
              <button className="icon small" onClick={closeOverlay} type="button" title="Close [C]">
                <Icon path={mdiClose} />
              </button>
            </div>
            <div className="modal-details-block" style={{ height: 'min-content' }}>
              <NameField type="habit" />
            </div>
            {habitID && (
              <Habit
                heatmap={heatmap}
                habit={habit}
                modal={true}
                overridenElimination={values.elimination}
                overridenNumeric={values.numeric}
              />
            )}
            <div className="modal-details-habit-wrapper">
              <div className="modal-details-block description-area">
                <DescriptionField rows="12" />
              </div>
              <div className="modal-details-block mode-area">
                <div className="form-task-description">
                  <Field
                    name="elimination"
                    component="input"
                    type="checkbox"
                    className="checkbox"
                  />
                  <label>Use elimination</label>
                </div>
                <div className="form-task-description">
                  <Field name="numeric" component="input" type="checkbox" className="checkbox" />
                  <label>Use numeric</label>
                </div>
              </div>
              <div className="modal-details-block color-area">
                <ColorPicker />
              </div>
            </div>
            <ModalButtons disabled={submitting} isNew={!habitID} type="habit" />
          </form>
        )}
      />
    </>
  );
}
