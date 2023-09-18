import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetTasksQuery } from '../../state/services/todolist';
import { useGetHabitsQuery } from '../../state/services/habit';
import { useGetHeatmapsQuery } from '../../state/services/heatmap';
import Habit from '../../components/Habit';

export default function HabitOverview() {
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
    <Habit
      heatmap={heatmap}
      habit={habit}
    />
  );
}
