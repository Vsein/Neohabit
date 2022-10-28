import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ToDo from './pages/ToDo';
import Signup from './pages/Signup';

const RouteSwitch = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<ToDo />} />
      <Route path="signup/" element={<Signup />} />
    </Routes>
  </BrowserRouter>
);

export default RouteSwitch;
