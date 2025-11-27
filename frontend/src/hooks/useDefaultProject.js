import { useGetHabitsQuery } from '../state/services/habit';
import { useGetProjectsQuery } from '../state/services/project';

export default function useStopwatch() {
  const habits = useGetHabitsQuery();
  const projects = useGetProjectsQuery();

  if (habits.isFetching || projects.isFetching) {
    return [{
      name: 'Default',
      color: '#8a8a8a',
      habits: [],
      _id: 'default',
    }];
  }

  const defaultProject = {
    name: 'Default',
    color: '#8a8a8a',
    habits: habits.data.filter((habit) => {
      const found =
        projects.data &&
        projects.data.find((project) =>
          project.habits.find((projectHabitID) => habit._id === projectHabitID),
        );
      return found === -1 || found === undefined;
    }),
    _id: 'default',
  };

  return [ defaultProject ];
}
