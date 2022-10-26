import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ToDo from './UI/ToDo';

const RouteSwitch = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ToDo list="All"/>} />
      <Route path="/all" element={<ToDo list="All"/>} />
      <Route path="/today" element={<ToDo list="Today"/>} />
      <Route path="/this-week" element={<ToDo list="This Week"/>} />
      <Route path="/important" element={<ToDo list="Important"/>} />
    </Routes>
  </BrowserRouter>
);

export default RouteSwitch;
