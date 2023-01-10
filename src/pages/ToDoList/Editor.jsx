import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetTasksQuery,
  useGetProjectsQuery,
} from '../../state/services/todolist';
import Tasklist from '../../components/Tasklist';

export default function Editor() {
  const tasks = useGetTasksQuery();
  const projects = useGetProjectsQuery();
  const { list, projectID } = useParams();

  const delinkify = (str) =>
    str
      .toLowerCase()
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');

  const delist = delinkify(list);

  return tasks.isFetching || projects.isFetching ? (
    <> </>
  ) : (
    <div className="tasklist">
      <Tasklist
        name={list !== 'project' ? delist : tasks.data[0]?.project.name}
        tasks={tasks.data}
        projectID={projectID}
        list={list}
      />
    </div>
  );
}
