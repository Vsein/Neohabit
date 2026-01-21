import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useTitle from '../hooks/useTitle';

export default function NotFound() {
  useTitle('Blocks | Neohabit');
  const navigate = useNavigate();

  return (
    <div className="contentlist" style={{ paddingInline: '15px' }}>
      <div className="contentlist-header">
        <h3>A sneak peek</h3>
      </div>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        My ultimate vision for Neohabit is to have a public, community-driven base of habits, which
        you would be able to explore and pick the ones you would like to build. I&apos;ll aim to
        make them easily importable to your account, with preset progressions and goals.
      </p>
      <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
        I believe it would prove to be incredibly useful, because there are things which need to be
        followed to preserve our health and edge. Those sets of habits are basically building blocks
        of our lives, hence the name Blocks.
      </p>
      <p className="back-ref">
        <Link onClick={() => navigate(-1)}>Go back</Link>
      </p>
    </div>
  );
}
