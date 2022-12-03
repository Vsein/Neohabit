import React from 'react';

import { useParams } from 'react-router-dom';
import { useGetProjectsQuery } from '../../state/services/todolist';

export default function Header() {
  const { projectID } = useParams();
  const project =
    useGetProjectsQuery().data.find((projecto) => projecto._id == projectID) ??
    useGetProjectsQuery().data.find((projecto) => projecto.name == 'Default');

  return (
    <div className="projectpage-header">
      <Skill color={project.color} name={project.name} />
      <div className="welcome">
        <p className="hello">Hello there,</p>
        <p className="username">Serene Coder (&#64;Vsein)</p>
      </div>
      <button className="dashboard-btn" id="new">
        New
      </button>
      <button className="dashboard-btn" id="upload">
        Upload
      </button>
      <button className="dashboard-btn" id="share-variant-outline">
        Share
      </button>
    </div>
  );
}

function Skill(props) {
  const { color, name } = props;
  return (
    <button className="skill-icon" style={{ backgroundColor: color }}>
      {name}
    </button>
  );
}
