import React from 'react';

export default function ProjectTag(props) {
  const { project } = props;
  return (
    <>
      <div className="centering">
        <div
          className="project-circle"
          style={{ backgroundColor: project.color }}
        ></div>
      </div>
      {project.name === 'Neohabit' ? (
        <p className="neohabit" />
      ) : (
        <p>{project.name}</p>
      )}
    </>
  );
}
