import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useTitle from '../hooks/useTitle';

export default function NotFound() {
  useTitle('Blocks | Neohabit');
  const navigate = useNavigate();

  return (
    <div className="contentlist">
      <div className="contentlist-header">
        <h3>A sneak peek</h3>
      </div>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        Our ultimate vision for Neohabit is to have a big public base of habits, which you would be
        able to explore and pick the ones you would like to build. We aim to make them easily
        importable to your account, with preset progressions and goals.
      </p>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        We belive it would prove to be incredibly useful, because sometimes there are things which
        need to be followed to preserve our health and edge, like optimizing melatonin production
        for better sleep (see Andrew Huberman&apos;s podcast on the topic). Those sets of habits are
        basically building blocks of our lives, hence the name Blocks.
      </p>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        Since our implementation of habit-building is easily customizable, very forgiving in terms
        of time consumption, and ridden of self-enforced unrealistic schedules, we belive it to be a
        perfect foundation for a public base of habits.
      </p>
      <p className="back-ref">
        <Link onClick={() => navigate(-1)}>Go back</Link>
      </p>
    </div>
  );
}
