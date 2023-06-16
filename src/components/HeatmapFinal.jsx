import React, { useEffect } from 'react';
import {
  addDays,
  addHours,
  subMilliseconds,
  min,
  max,
  startOfDay,
  differenceInHours,
  startOfWeek,
} from 'date-fns';
import { Form, Field } from 'react-final-form';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { CellPeriod, TallDummy } from './HeatmapCells';
import { HeatmapMonths, HeatmapWeekdays } from './HeatmapHeaders';
import useLoaded from '../hooks/useLoaded';
import { useUpdateHeatmapMutation } from '../state/services/heatmap';

function Heatmap({
  dateStart,
  dateEnd,
  heatmap = {
    data: [],
  },
  colorFunc,
  dayLength,
  useElimination = true,
}) {
  const [loaded] = useLoaded();
  const Data = heatmap.data;
  const data = [...Data];
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  let dateNow = dateStart;
  let i = 0;
  const periods = [];
  for (let i = 0; i < data.length; i++) {
    const dateStartChunk = startOfDay(new Date(data[i].date));
    periods.push({
      color: '',
      value: 0,
      dateStart: dateNow,
      dateEnd: subMilliseconds(startOfDay(new Date(data[i].date)), 1),
    });
    periods.push({
      color: colorFunc({ alpha: 1 }),
      value: 1000,
      dateStart: dateStartChunk,
      dateEnd: subMilliseconds(addHours(startOfDay(new Date(data[i].date)), 24), 1),
    });
    dateNow = addHours(dateStartChunk, 24);
  }
  periods.push({
    color: '',
    value: 0,
    dateStart: dateNow,
    dateEnd: dateEnd,
  })
  console.log(periods);

  const dummyLastDay = dateStart;
  const dummyHeight =
    differenceInHours(startOfDay(dummyLastDay), startOfWeek(dummyLastDay)) / 24;

  const [updateHeatmap] = useUpdateHeatmapMutation();
  const onSubmit = async (values) => {
    await updateHeatmap({ heatmapID: heatmap._id, values });
  };

  return !loaded ? (
    <div
      className="habit loading"
      style={{ backgroundColor: '#ddd', borderRadius: '20px' }}
    />
  ) : (
    <div className="habit">
      <div className="habit-header">
        <h4>Habit</h4>
        <Form
          initialValues={{
            date: undefined,
            value: undefined,
          }}
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit} className="habit-form">
              <div className="habit-form-date">
                <label htmlFor="date-name">
                  <Field
                    name="date"
                    component="input"
                    type="date"
                    placeholder="Change project name"
                    max="<?= date('Y-m-d'); ?>"
                    rows="1"
                    className="habit-form-input"
                  />
                </label>
              </div>
              <div className="habit-form-counter">
                <label htmlFor="date-name">
                  <Field
                    name="value"
                    component="input"
                    type="number"
                    placeholder="1"
                    max="999"
                    min="0"
                    className="habit-form-input"
                  />
                </label>
              </div>
              <button className="habit-button" type="submit" disabled={submitting || pristine }>
                <Icon path={mdiPlus} className="add-task-icon icon" />
              </button>
            </form>
          )}
        />
      </div>
      <div className="heatmap" style={{ '--multiplier': dayLength }}>
        <HeatmapMonths dateStart={startOfWeek(dummyLastDay)} />
        <HeatmapWeekdays dateStart={dateStart} />
        <div className="heatmap-cells">
          <TallDummy height={dummyHeight} />
          {periods.map((chunk, index) => (
            <CellPeriod
              key={index}
              dateStart={chunk.dateStart}
              dateEnd={chunk.dateEnd}
              color={chunk.color}
              value={chunk.value}
              multiplier={2}
              basePeriod={24}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { Heatmap };
