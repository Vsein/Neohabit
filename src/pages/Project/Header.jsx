import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProjectsQuery, useDeleteProjectMutation } from '../../state/services/project';
import { changeTo, open } from '../../state/features/projectOverlay/projectOverlaySlice';

export default function Header() {
  const { projectID } = useParams();
  const project =
    useGetProjectsQuery().data.find((projecto) => projecto._id == projectID) ??
    useGetProjectsQuery().data.find((projecto) => projecto.name == 'Default');
  const [deleteProject] = useDeleteProjectMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteThisProject = (e) => {
    deleteProject(projectID);
    navigate('...');
    navigate('/dashboard');
  };

  return (
    <div className="projectpage-header">
      <Link
        onClick={() => {
          dispatch(changeTo(projectID));
          dispatch(open());
        }}
      >
        <Skill color={project.color} name={project.name} />
      </Link>
      <div className="welcome">
        <p className="hello">Hello there,</p>
        <p className="username">Serene Coder (&#64;Vsein)</p>
      </div>
      <button className="dashboard-btn" id="new" onClick={deleteThisProject}>
        Delete
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
