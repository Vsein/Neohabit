import { useGetHabitsOutsideProjectsQuery } from '../state/services/habit';

export default function useDefaultProject() {
  const habits = useGetHabitsOutsideProjectsQuery();

  const defaultProject = {
    name: 'Default',
    color: '#8a8a8a',
    habits: habits.data,
    id: 'default',
  };

  return [defaultProject];
}
