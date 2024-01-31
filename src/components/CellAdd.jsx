import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatISO, addDays } from 'date-fns';
import { Form } from 'react-final-form';
import { Icon } from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { useUpdateHeatmapMutation } from '../state/services/heatmap';
import { close } from '../state/features/cellAdd/cellAddSlice';
import { DateField, ActionsField, PeriodField } from './CellAddFields';
import { getUTCOffsettedDate } from '../hooks/useDatePeriod';

export default function CellAdd() {
  const dispatch = useDispatch();
  const [updateHeatmap] = useUpdateHeatmapMutation();
  const { heatmapID, isTarget, isActive } = useSelector((state) => state.cellAdd);
  const closeDropdown = () => {
    dispatch(close());
    const cellAddDropdown = document.querySelector('.cell-add-dropdown');
    cellAddDropdown.style.top = '0px';
    cellAddDropdown.style.left = '0px';
  };
  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  });
  const onSubmit = async (values) => {
    await updateHeatmap({
      heatmapID,
      values: {
        ...values,
        date: getUTCOffsettedDate(
          addDays(new Date(values.date), new Date().getTimezoneOffset() > 0 * 1),
        ),
      },
    });
    closeDropdown();
  };

  return isTarget ? (
    <div
      className={`cell-add-dropdown target centering ${isActive ? '' : 'hidden'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Add a new target</h3>
      <CellAddTargetForm onSubmit={onSubmit} />
    </div>
  ) : (
    <div
      className={`cell-add-dropdown centering ${isActive ? '' : 'hidden'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Add completed actions</h3>
      <CellAddPointForm onSubmit={onSubmit} />
    </div>
  );
}

function CellAddPointForm({ onSubmit }) {
  return (
    <Form
      initialValues={{
        date: formatISO(new Date(), { representation: 'date' }),
        value: 1,
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, invalid, form, submitting, pristine, values }) => (
        <form
          onSubmit={async (e) => {
            await handleSubmit(e);
            if (!invalid) {
              form.reset();
            }
          }}
          className="habit-form"
        >
          <DateField />
          <ActionsField />
          <button className="habit-button" type="submit" disabled={submitting}>
            <Icon path={mdiPlus} className="icon small" />
          </button>
        </form>
      )}
    />
  );
}

function CellAddTargetForm({ onSubmit }) {
  return (
    <Form
      initialValues={{
        date: formatISO(new Date(), { representation: 'date' }),
        value: 1,
        period: 1,
        is_target: true,
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, invalid, form, submitting, pristine, values }) => (
        <form
          onSubmit={async (e) => {
            await handleSubmit(e);
            if (!invalid) {
              form.reset();
            }
          }}
          className="habit-form target"
        >
          <span>Starting from </span>
          <DateField />
          <span>, aim to do</span>
          <ActionsField />
          <span> action(s) in </span>
          <PeriodField />
          <span>day(s)</span>
          <button className="habit-button right" type="submit" disabled={submitting}>
            <Icon path={mdiPlus} className="icon small" />
          </button>
        </form>
      )}
    />
  );
}
