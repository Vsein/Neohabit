import React from 'react';
import useTitle from '../../hooks/useTitle';
import useLoaded from '../../hooks/useLoaded';

export default function Habits() {
  useTitle('Habits | Neohabit');
  const [loaded] = useLoaded();

  return (
    loaded && (
      <main className="habits">
        <div className="habits-header">
          <h3>Habits</h3>
        </div>
        <ul className="habits-list">
        </ul>
      </main>
    )
  );
}
