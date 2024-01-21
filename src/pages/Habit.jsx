import React from 'react';
import { Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import { useGetTasksQuery } from '../state/services/todolist';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
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
  const tasks = useGetTasksQuery();
  const habits = useGetHabitsQuery();
  const heatmaps = useGetHeatmapsQuery();
  const { habitID } = useParams();
  const habit =
    useGetHabitsQuery().data.find((habito) => habito._id === habitID) ??
    useGetHabitsQuery().data.find((habito) => habito.name === 'Default');
  const heatmap = useGetHeatmapsQuery().data.find((heatmapo) => heatmapo.habit._id === habitID);

  return tasks.isFetching || habits.isFetching || heatmaps.isFetching ? (
    <> </>
  ) : (
    <div className="contentlist">
      <Habit heatmap={heatmap} habit={habit} habitPage={true} />
    </div>
  );
}
