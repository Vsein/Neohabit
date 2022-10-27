import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ToDo from './UI/ToDo';

const RouteSwitch = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<ToDo />} />
    </Routes>
  </BrowserRouter>
);

export default RouteSwitch;
