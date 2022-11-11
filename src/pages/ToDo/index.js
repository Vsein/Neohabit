import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Editor from './Editor';
import Overlay from './Overlay';

export default function ToDo() {
  useEffect(() => {
    document.title = 'To-do list | Neohabit';
  });

  return (
    <Routes>
      <Route index element={<Navigate to="all" />} />
      <Route path=":list/:projectID" element={<Editor />} >
        <Route path="task/:taskID" element={<Overlay />} />
      </Route>
      <Route path=":list" element={<Editor />} >
        <Route path="task/:taskID" element={<Overlay />} />
      </Route>
    </Routes>
  );
}
