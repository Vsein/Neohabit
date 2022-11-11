import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 | Neohabit';
  });

  const navigate = useNavigate();

  return (
    <main className="editor">
      <div className="editor-header">
        <h3>Error: 404</h3>
      </div>
      <p className="back-ref">
        There doesn&apos;t seem to be anything...
        <a tabIndex="0" onClick={() => navigate(-1)}>Go back</a>
      </p>
    </main>
  );
}
