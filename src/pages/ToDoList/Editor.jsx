import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetTasksQuery } from '../../state/services/todolist';
import { useGetHabitsQuery } from '../../state/services/habit';
import Tasklist from '../../components/Tasklist';

export default function Editor() {
  const tasks = useGetTasksQuery();
  const habits = useGetHabitsQuery();
  const { list, habitID } = useParams();

  const delinkify = (str) =>
    str
      .toLowerCase()
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');

  const delist = delinkify(list);

  return (
    <div className="tasklist">
      <Tasklist
        name={list !== 'habit' ? delist : tasks.data[0]?.habit.name}
        tasks={tasks.data}
        habitID={habitID}
        list={list}
      />
    </div>
  );
}
