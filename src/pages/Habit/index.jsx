import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import { useGetHabitsQuery } from '../../state/services/habit';
import { useGetHeatmapsQuery } from '../../state/services/heatmap';
import Header from './Header';
import Navigation from './Navigation';
import Overview from './Overview';

export default function Habit() {
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
    <div id="content-habit">
      <Header habits={habits.data} />
      <Navigation />
      <Outlet />
    </div>
  );
}
