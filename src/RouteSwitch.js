import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ToDo from './pages/ToDoPage';
import Signup from './pages/SignupPage';
import Dashboard from './pages/DashboardPage';

const RouteSwitch = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/todo/*" element={<ToDo />} />
      <Route path="/signup/" element={<Signup />} />
      <Route path="/dashboard/" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);

export default RouteSwitch;
