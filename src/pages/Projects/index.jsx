import React from 'react';
import useTitle from '../../hooks/useTitle';
import useLoaded from '../../hooks/useLoaded';

export default function Projects() {
  useTitle('Projects | Neohabit');
  const [loaded] = useLoaded();

  return (
    loaded && (
      <main className="projects">
        <div className="projects-header">
          <h3>Projects</h3>
        </div>
        <ul className="projects-list">
        </ul>
      </main>
    )
  );
}
