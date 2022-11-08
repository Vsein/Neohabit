import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import ToDo from './pages/ToDo';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { checkAuthentication } from './api/get';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signup/" element={<Signup />} />
      <Route path="/login/" element={<Login />} />
      <Route path="/" element={<PrivateRoutes />}>
        <Route path="/dashboard/" element={<Dashboard />} />
        <Route path="/todo/*" element={<ToDo />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

const PrivateRoutes = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function init() {
      const status = await checkAuthentication();
      setLoggedIn(status);
    }
    init();
  }, []);

  if (loggedIn === undefined) {
    return null; // or loading indicator/spinner/etc
  }

  return loggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default App;
