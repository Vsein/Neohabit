import React from 'react';
import { Routes, Route, Outlet, useParams, useNavigate } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import { useGetTasksQuery } from '../state/services/todolist';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
import { useGetSettingsQuery } from '../state/services/settings';
import useDatePeriod, { getAdaptivePeriodLength } from '../hooks/useDatePeriod';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { ReturnButton } from '../components/HabitComponents';
import { DatePeriodPicker } from '../components/DatePickers';
import Habit from '../components/Habit';

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
  const settings = useGetSettingsQuery();
  const { habitID } = useParams();
  const habit =
    useGetHabitsQuery().data.find((habito) => habito._id === habitID) ??
    useGetHabitsQuery().data.find((habito) => habito.name === 'Default');
  const heatmap = useGetHeatmapsQuery().data.find((heatmapo) => heatmapo.habit._id === habitID);
  const vertical = false;

  const { width } = useWindowDimensions();
  const { adaptiveDatePeriodLength, mobile } = getAdaptivePeriodLength(width);
  const datePeriodLength =
    settings.data?.overview_adaptive ?? true
      ? Math.min(
          adaptiveDatePeriodLength,
          settings.data?.overview_apply_limit ?? true
            ? settings.data?.overview_duration_limit ?? 32
            : Infinity,
        )
      : settings.data?.overview_duration ?? 32;

  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, subPeriod, addPeriod, setToPast, setToFuture, reset },
  ] = useDatePeriod(datePeriodLength, true);

  return tasks.isFetching || habits.isFetching || heatmaps.isFetching || settings.isFetching ? (
    <> </>
  ) : (
    <>
      <div className="contentlist-controls">
        <div className="overview-centering" style={{ width: 'max-content' }}>
          <button
            className={`overview-habit-add standalone topbar ${vertical ? 'vertical' : ''}`}
            onClick={() => navigate(-1)}
            style={{ gridTemplateColumns: 'min-content 150px'}}
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
        />
      </div>
    <div className="contentlist">
      <Habit heatmap={heatmap} habit={habit} habitPage={true} />
    </div>
    </>
  );
}
