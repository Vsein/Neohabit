import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ToDo from './pages/ToDo';
import Signup from './pages/SignUp';
import Dashboard from './pages/Dashboard';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/todo/*" element={<ToDo />} />
      <Route path="/signup/" element={<Signup />} />
      <Route path="/dashboard/" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);

export default App;
