import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 | Neohabit';
  });

  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  }

  return (
    <main className="editor">
      <div className="editor-header">
        <h3>Error: 404</h3>
      </div>
      <p className="back-ref">
        There doesn&apos;t seem to be anything...
        <a tabIndex="0" onClick={goBack}>Go back</a>
      </p>
    </main>
  );
}
