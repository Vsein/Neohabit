import React from 'react';
import { Routes, Route, Outlet, useParams, useNavigate } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import { useGetTasksQuery } from '../state/services/todolist';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
import useDatePeriod, { getAdaptivePeriodLength } from '../hooks/useDatePeriod';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { ReturnButton } from '../components/HabitComponents';
import { DatePeriodPicker } from '../components/DatePickers';
import { HabitDefaultWrapper } from '../components/Habit';
import { generateShades } from '../hooks/usePaletteGenerator';

export default function HabitPage() {
  useTitle('Habit | Neohabit');

  return (
    <Routes>
      <Route element={<HabitLayout />}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="heatmap" element={<Overview />} />
        <Route path="skill-tree" element={<Overview />} />
        <Route path="to-do" element={<Overview />} />
        <Route path="notes" element={<Overview />} />
      </Route>
    </Routes>
  );
}

function HabitLayout() {
  const habits = useGetHabitsQuery();
  const heatmaps = useGetHeatmapsQuery();

  return habits.isFetching || heatmaps.isLoading || heatmaps.isFetching ? (
    <div className="loader" />
  ) : (
    <Outlet />
    // {/* <div className="page-habit"> */}
    //   {/* <Header habits={habits.data} /> */}
    //   {/* <Navigation /> */}
    // // </div>
  );
}

function Overview() {
  const navigate = useNavigate();
  const tasks = useGetTasksQuery();
  const habits = useGetHabitsQuery();
  const heatmaps = useGetHeatmapsQuery();
  const { habitID } = useParams();
  const habit =
  const heatmap = useGetHeatmapsQuery().data.find((heatmapo) => heatmapo.habit._id === habitID);
    useGetHabitsQuery().data.find((h) => h.id === habitID) ??
    useGetHabitsQuery().data.find((h) => h.name === 'Default');
  const vertical = false;

  const { width } = useWindowDimensions();
  const { adaptiveDatePeriodLength, mobile } = getAdaptivePeriodLength(width, true);

  const datePeriodLength = adaptiveDatePeriodLength < 53 ? adaptiveDatePeriodLength : 53;
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { setToPast, setToFuture, reset, addPeriod, subPeriod, isPastPeriod, isFuturePeriod },
  ] = useDatePeriod(datePeriodLength, true, true);

  const { colorShade, calmColorShade, textColor, calmTextColor } = generateShades(habit.color);

  return tasks.isFetching || habits.isFetching || heatmaps.isFetching ? (
    <div className="loader" />
  ) : (
    <>
      <div
        className="contentlist-controls"
        style={{
          '--signature-color': colorShade,
          '--bright-signature-color': colorShade,
          '--calm-signature-color': `${colorShade}55`,
          '--datepicker-text-color': textColor,
          '--datepicker-calm-text-color': calmTextColor,
        }}
      >
        <div className="overview-centering" style={{ width: 'max-content' }}>
          <button
            className={`overview-habit-add standalone topbar ${vertical ? 'vertical' : ''}`}
            onClick={() => navigate(-1)}
            style={{ gridTemplateColumns: 'min-content 150px' }}
            title="Add a new habit [A]"
          >
            <ReturnButton />
            <p>Return</p>
          </button>
        </div>
        <DatePeriodPicker
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          subPeriod={subPeriod}
          addPeriod={addPeriod}
          setToPast={setToPast}
          reset={reset}
          setToFuture={setToFuture}
          mobile={mobile}
          isPastPeriod={isPastPeriod}
          isFuturePeriod={isFuturePeriod}
        />
      </div>
      <div className="contentlist">
        <HabitDefaultWrapper
          heatmap={heatmap}
          habit={habit}
          habitPage={true}
          dateStart={dateStart}
          dateEnd={dateEnd}
          mobile={mobile}
        />
      </div>
    </>
  );
}
